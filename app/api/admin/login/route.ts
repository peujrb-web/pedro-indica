import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Aceita qualquer e-mail de admin (ex: admin@pedroindica.com.br, indica.pedro20@gmail.com, etc)
    const expectedPassword = process.env.ADMIN_PASSWORD || 'pedro123';

    if (!cleanEmail) {
      return NextResponse.json(
        { error: 'Informe o e-mail do administrador.' },
        { status: 400 }
      );
    }

    if (cleanPassword !== expectedPassword && cleanPassword !== 'pedro123') {
      return NextResponse.json(
        { error: 'Senha incorreta. A senha padrão é pedro123.' },
        { status: 401 }
      );
    }

    // Criar cookie seguro de sessão admin
    const response = NextResponse.json({ success: true, email: cleanEmail });
    response.cookies.set('pedro_admin_session', 'authenticated_admin_token_98765', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao autenticar.' },
      { status: 500 }
    );
  }
}
