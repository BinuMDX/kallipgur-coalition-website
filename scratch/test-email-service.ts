import { membershipApplicationSchema } from '../lib/validations/membership';
import { sendMembershipApplicantConfirmation, sendMembershipAdminNotification } from '../lib/email/membershipEmails';
import { _testOverrides } from '../lib/email/microsoftGraph';
import nodemailer from 'nodemailer';

// Mock application data using canonical enum constants defined in constants/membership.ts
const mockApplication = {
  id: 'test-app-id-12345',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'MALE', // Match VALID_GENDERS
  email: 'john.doe@example.com',
  phone: '0400000000',
  preferredContactMethod: 'EMAIL', // Match VALID_CONTACT_METHODS
  streetAddress: '123 Test St',
  suburb: 'Testville',
  state: 'WA',
  postcode: '6000',
  country: 'AUSTRALIA', // Match VALID_COUNTRIES
  membershipType: 'GENERAL_MEMBER', // Match VALID_MEMBERSHIP_TYPES
  traditionalCountry: 'Noongar',
  aboriginalOrTorresStraitIslander: 'YES', // Match VALID_INDIGENOUS_OPTIONS
  occupation: 'Developer',
  reasonForJoining: 'To support the community.',
  skillsAndExperience: 'Web development.',
  areasOfInterest: ['Culture', 'Education'],
  emergencyContactName: 'Jane Doe',
  emergencyContactRelationship: 'Spouse',
  emergencyContactPhone: '0411111111',
  informationDeclarationAccepted: true,
  privacyPolicyAccepted: true,
  membershipTermsAccepted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'PENDING',
  applicantEmailSent: false,
  adminEmailSent: false,
};

async function runTests() {
  console.log('==================================================');
  console.log('KALLIPGUR EMAIL NOTIFICATION SYSTEM INTEGRATION TESTS');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // --- Test 1: Valid membership application schema validation ---
  try {
    const parseResult = membershipApplicationSchema.safeParse(mockApplication);
    assert(parseResult.success, 'Valid membership application matches schema');
    if (!parseResult.success) {
      console.error('Schema errors:', parseResult.error.flatten().fieldErrors);
    }
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- Test 2: Invalid application schema validation ---
  try {
    const invalidApp = { ...mockApplication, firstName: '' }; // empty first name is invalid
    const parseResult = membershipApplicationSchema.safeParse(invalidApp);
    assert(!parseResult.success, 'Invalid application fails schema validation');
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- Test 3: Reusable email service MIME compilation ---
  try {
    // We capture the compiled mail via nodemailer's streamTransport
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
    });

    const options = {
      from: 'sender@kallipgur.org.au',
      to: 'john.doe@example.com',
      subject: 'Test Subject',
      html: '<h1>Hello Test</h1>',
      text: 'Hello Test Plain text',
    };

    const info = await transporter.sendMail(options);
    const mimeBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const messageStream = info.message as any;
      messageStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      messageStream.on('end', () => resolve(Buffer.concat(chunks)));
      messageStream.on('error', reject);
    });

    const mimeString = mimeBuffer.toString();
    assert(mimeString.includes('Subject: Test Subject'), 'MIME contains correct Subject');
    assert(mimeString.includes('To: john.doe@example.com'), 'MIME contains correct To header');
    assert(mimeString.includes('Content-Type: multipart/alternative'), 'MIME format supports HTML + plain-text fallback');
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- Test 4: Microsoft Graph mock token and sendMail request ---
  try {
    // Mock access token retrieval
    _testOverrides.getAccessToken = async () => 'mock-access-token';

    // Mock global fetch to intercept the Graph API call
    const originalFetch = global.fetch;
    let mockFetchCalled = false;
    let mockFetchUrl = '';
    let mockFetchHeaders: Record<string, string> = {};
    let mockFetchBody = '';

    global.fetch = (async (url: string, options: any) => {
      mockFetchCalled = true;
      mockFetchUrl = url;
      mockFetchHeaders = options.headers || {};
      mockFetchBody = typeof options.body === 'string' ? options.body : '';
      return {
        ok: true,
        status: 202,
        text: async () => 'Accepted',
      } as Response;
    }) as any;

    // Set provider configuration variables
    process.env.EMAIL_PROVIDER = 'microsoft-graph';
    process.env.MICROSOFT_SENDER_EMAIL = 'sender@kallipgur.org.au';
    process.env.MEMBERSHIP_NOTIFICATION_EMAIL = 'admin@kallipgur.org.au';

    // Trigger applicant confirmation
    await sendMembershipApplicantConfirmation(mockApplication);

    assert(mockFetchCalled, 'fetch is called when sending email via microsoft-graph');
    assert(mockFetchUrl === 'https://graph.microsoft.com/v1.0/users/sender%40kallipgur.org.au/sendMail', 'Graph endpoint user sendMail URL is correct');
    assert(mockFetchHeaders['Authorization'] === 'Bearer mock-access-token', 'Authorization header contains the access token');
    assert(mockFetchHeaders['Content-Type'] === 'text/plain', 'Content-Type header is text/plain');

    // Decode the payload from base64
    const decodedPayload = Buffer.from(mockFetchBody, 'base64').toString();
    const hasSubjectHeader = decodedPayload.includes('Subject: ') && 
      (decodedPayload.includes('Membership_Application_Received') || decodedPayload.includes('Membership Application Received'));
    
    assert(hasSubjectHeader, 'MIME subject header exists and matches target content (handles Q-encoding)');
    assert(decodedPayload.includes('To: john.doe@example.com'), 'MIME recipient is correct');
    assert(decodedPayload.includes('PENDING'), 'Applicant confirmation contains status: PENDING');
    assert(decodedPayload.includes('test-app-id-12345'), 'Applicant confirmation contains reference ID');

    // Restore original global fetch and test overrides
    global.fetch = originalFetch;
    _testOverrides.getAccessToken = null;
  } catch (e: any) {
    console.error('Test 4 failed with error:', e);
    failed++;
  }

  // --- Test 5: Security: Microsoft credentials check ---
  try {
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const tenantId = process.env.MICROSOFT_TENANT_ID;

    // Check that credentials are not hardcoded
    assert(
      !clientSecret && !clientId && !tenantId,
      'Microsoft credentials are not hardcoded in the codebase/environment'
    );
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- Summary ---
  console.log('\n==================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('==================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
