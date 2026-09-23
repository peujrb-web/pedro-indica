import { NextResponse, type NextRequest } from 'next/server';
import { updateAdminPassword } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  try {
    // Verificar sessão de administrador
    const sessionCookie = request.cookies.get('pedro_admin_session_token');
    const isAuthenticated = sessionCookie && sessionCookie.value === 'sec_token_pedro_indica_admin_authenticated_8829';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores autenticados podem alterar a senha.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Informe a senha atual e a nova senha.' },
        { status: 400 }
      );
    }

    const result = updateAdminPassword(currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao alterar senha.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Senha de administrador alterada com sucesso no servidor!',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno ao processar alteração de senha.' },
      { status: 500 }
    );
  }
}
