import { requireAdmin } from '@/lib/admin-auth';
import { PostForm } from '../PostForm';

export const dynamic = 'force-dynamic';

export default async function NewPost() {
  await requireAdmin();
  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Nouvel article</h1>
      <PostForm mode="create" />
    </div>
  );
}
