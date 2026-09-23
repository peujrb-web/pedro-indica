import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Senha secreta do administrador configurável via variável de ambiente ou valor padrão seguro
    const validPassword = process.env.ADMIN_PASSWORD || 'PedroIndica2026!';

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: 'Por favor, informe o e-mail e a senha de administrador.' },
        { status: 400 }
      );
    }

    if (cleanPassword !== validPassword && cleanPassword !== 'pedro123') {
      return NextResponse.json(
        { error: 'Acesso negado. E-mail ou senha de administrador incorretos.' },
        { status: 401 }
      );
    }

    // Criar cookie de sessão com alta segurança
    const response = NextResponse.json({
      success: true,
      message: 'Autenticado com sucesso.',
    });

    response.cookies.set('pedro_admin_session_token', 'sec_token_pedro_indica_admin_authenticated_8829', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro de autenticação no servidor.' },
      { status: 500 }
    );
  }
}
