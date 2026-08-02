import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Dashboard | Kallipgur Admin',
};

export default function AdminDashboardPage() {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold text-neutral-100">
          Welcome to the Kallipgur Administration Portal
        </h1>
        <p className="mt-4 text-neutral-400 max-w-2xl">
          Use the sidebar to navigate through the administration tools. Additional modules for membership management, news, gallery, and donations will be implemented in future updates.
        </p>

        {/* Dashboard Placeholder Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-neutral-900 border border-neutral-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1 w-0">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-400 truncate">
                      Pending Applications
                    </dt>
                    <dd className="text-lg font-medium text-neutral-100">
                      --
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-neutral-800 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                  View all
                </a>
              </div>
            </div>
          </div>
          
          {/* More cards can be added here */}
        </div>
      </div>
    </Container>
  );
}
