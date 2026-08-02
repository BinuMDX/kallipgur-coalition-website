import { validateStatusTransition, statusUpdateSchema } from '../lib/validations/status';
import { ApplicationStatus } from '@prisma/client';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('Running membership status workflow transition & validation tests...\n');

// ── TEST 1: Zod Schema validation for allowed statuses ──
const allowedStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
for (const status of allowedStatuses) {
  const result = statusUpdateSchema.safeParse({ status });
  assert(result.success, `Zod validation should succeed for allowed status: ${status}`);
}

// ── TEST 2: Zod Schema validation for invalid statuses ──
const invalidStatuses = ['approved', 'pending', 'foo', '', null, undefined, 'APPROVED_RANDOM'];
for (const status of invalidStatuses) {
  const result = statusUpdateSchema.safeParse({ status });
  assert(!result.success, `Zod validation should fail for invalid status: ${status}`);
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message;
    assert(errorMessage === 'Invalid membership application status.', `Error message must be "Invalid membership application status.", got "${errorMessage}"`);
  }
}

// ── TEST 3: Valid Transitions ──
// PENDING -> UNDER_REVIEW
assert(
  validateStatusTransition('PENDING' as ApplicationStatus, 'UNDER_REVIEW' as ApplicationStatus),
  'Transition PENDING -> UNDER_REVIEW should be allowed'
);

// PENDING -> REJECTED
assert(
  validateStatusTransition('PENDING' as ApplicationStatus, 'REJECTED' as ApplicationStatus),
  'Transition PENDING -> REJECTED should be allowed'
);

// UNDER_REVIEW -> APPROVED
assert(
  validateStatusTransition('UNDER_REVIEW' as ApplicationStatus, 'APPROVED' as ApplicationStatus),
  'Transition UNDER_REVIEW -> APPROVED should be allowed'
);

// UNDER_REVIEW -> REJECTED
assert(
  validateStatusTransition('UNDER_REVIEW' as ApplicationStatus, 'REJECTED' as ApplicationStatus),
  'Transition UNDER_REVIEW -> REJECTED should be allowed'
);

// Self transitions (no-op updates)
assert(
  validateStatusTransition('PENDING' as ApplicationStatus, 'PENDING' as ApplicationStatus),
  'Self transition PENDING -> PENDING should be allowed'
);
assert(
  validateStatusTransition('UNDER_REVIEW' as ApplicationStatus, 'UNDER_REVIEW' as ApplicationStatus),
  'Self transition UNDER_REVIEW -> UNDER_REVIEW should be allowed'
);
assert(
  validateStatusTransition('APPROVED' as ApplicationStatus, 'APPROVED' as ApplicationStatus),
  'Self transition APPROVED -> APPROVED should be allowed'
);
assert(
  validateStatusTransition('REJECTED' as ApplicationStatus, 'REJECTED' as ApplicationStatus),
  'Self transition REJECTED -> REJECTED should be allowed'
);

// ── TEST 4: Invalid Transitions ──
// APPROVED -> PENDING
assert(
  !validateStatusTransition('APPROVED' as ApplicationStatus, 'PENDING' as ApplicationStatus),
  'Transition APPROVED -> PENDING should NOT be allowed'
);

// APPROVED -> REJECTED
assert(
  !validateStatusTransition('APPROVED' as ApplicationStatus, 'REJECTED' as ApplicationStatus),
  'Transition APPROVED -> REJECTED should NOT be allowed'
);

// REJECTED -> APPROVED
assert(
  !validateStatusTransition('REJECTED' as ApplicationStatus, 'APPROVED' as ApplicationStatus),
  'Transition REJECTED -> APPROVED should NOT be allowed'
);

// PENDING -> APPROVED
assert(
  !validateStatusTransition('PENDING' as ApplicationStatus, 'APPROVED' as ApplicationStatus),
  'Transition PENDING -> APPROVED should NOT be allowed'
);

console.log('\nAll pure transition and Zod validation tests passed successfully!');
