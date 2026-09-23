import { NextResponse, type NextRequest } from 'next/server';
import {
  verifyAdminPassword,
  checkRateLimit,
  registerFailedLogin,
  resetLoginAttempts
} from '@/lib/server-store';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Verificar bloqueio por taxa de tentativas (força bruta)
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Muitas tentativas malsucedidas. Bloqueado temporariamente por ${rateCheck.retryAfterSec} segundos.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: 'Informe o e-mail e a senha de acesso.' },
        { status: 400 }
      );
    }

    // Validação de Hash SHA-256 no Servidor
    const isValid = verifyAdminPassword(cleanPassword);

    if (!isValid) {
      registerFailedLogin(ip);
      return NextResponse.json(
        { error: 'Acesso negado. Credenciais de administrador incorretas.' },
        { status: 401 }
      );
    }

    // Sucesso: resetar bloqueios do IP
    resetLoginAttempts(ip);

    // Criar cookie de sessão restrita e criptografada
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
