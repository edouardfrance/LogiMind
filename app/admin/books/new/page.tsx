import { requireAdmin } from '@/lib/admin-auth';
import { BookForm } from '../BookForm';

export const dynamic = 'force-dynamic';

export default async function NewBookPage() {
  await requireAdmin();
  return (
    <div style={{ padding: '32px 24px', maxWidth: 880, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Nouveau livre</h1>
      <BookForm mode="create" />
    </div>
  );
}
