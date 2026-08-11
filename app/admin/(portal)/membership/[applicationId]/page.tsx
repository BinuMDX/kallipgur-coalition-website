import MembershipDetailPageClient from '@/components/admin/membership/MembershipDetailPageClient';

export const metadata = {
  title: 'Application Details | Kallipgur Admin',
  description: 'Review applicant details, view supporting documentation, add notes, and adjust application review status.',
};

export default function MembershipDetailPage({
  params,
}: {
  params: { applicationId: string };
}) {
  return <MembershipDetailPageClient applicationId={params.applicationId} />;
}
