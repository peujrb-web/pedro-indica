import { NextResponse, type NextRequest } from 'next/server';
import { updatePublicContent } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação do administrador no servidor
    const sessionCookie = request.cookies.get('pedro_admin_session_token');
    const isAuthenticated = sessionCookie && sessionCookie.value === 'sec_token_pedro_indica_admin_authenticated_8829';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores autenticados podem publicar alterações.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings, groups } = body;

    // Atualizar o estado público no servidor
    const updated = updatePublicContent(settings, groups);

    return NextResponse.json({
      success: true,
      message: 'Alterações publicadas com sucesso! Todos os visitantes já podem ver os novos dados.',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao publicar alterações no servidor.' },
      { status: 500 }
    );
  }
}
