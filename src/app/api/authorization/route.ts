import { NextResponse } from 'next/server';
import { saveAuthorizedCPFs } from '@/app/(auth)/auth/authEmail';




export async function POST(request: Request) {
  try {
    // Extrair o corpo da requisição
    const body = await request.json();
    
    // Verificar se o corpo contém o array de CPFs
    if (!body || !Array.isArray(body.cpfs)) {
      return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 400 });
    }

    const cpfs: string[] = body.cpfs;

    // Chamar a função para salvar os CPFs no banco de dados
    await saveAuthorizedCPFs(cpfs);

    // Retornar uma resposta de sucesso
    return NextResponse.json({ message: 'CPFs autorizados salvos com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar CPFs autorizados:', error);
    // Retornar uma resposta de erro
    return NextResponse.json({ error: 'Erro ao salvar CPFs autorizados' }, { status: 500 });
  }
}

