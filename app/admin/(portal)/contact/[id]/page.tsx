import ContactDetailPageClient from '@/components/admin/contact/ContactDetailPageClient';

export const metadata = {
  title: 'Enquiry Details | Kallipgur Admin',
  description: 'View enquiry message details, update status, and communicate with submitter.',
};

export default function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ContactDetailPageClient id={params.id} />;
}
