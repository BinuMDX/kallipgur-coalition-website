import MembershipPageClient from '@/components/admin/membership/MembershipPageClient';

export const metadata = {
  title: 'Membership Applications | Kallipgur Admin',
  description: 'Manage and review membership applications submitted through the Kallipgur Coalition website.',
};

export default function MembershipPage() {
  return <MembershipPageClient />;
}
