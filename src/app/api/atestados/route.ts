import { NextResponse } from 'next/server';
import { readAllData, CreateUser, deleteUsuario } from '@/app/(auth)/auth/authEmail';
import { initAdmin } from '@/app/(auth)/auth/admin/firebaseAdmin';
import admin from 'firebase-admin';

let adminApp: admin.app.App;

const initAdminApp = async () => {
  if (!adminApp) {
    adminApp = await initAdmin();
  }
};

// Inicializa adminApp quando o módulo é carregado
initAdminApp();

export async function GET(request: Request) {
  try {
    const data = await readAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error); 
    return NextResponse.json({ success: false, error: `Failed to fetch data: ${error}` }, { status: 500 });
  }
}

/* post */
export async function POST(request: Request) {
  try {
    const { cpf, email, senha, nome, empresa, contrato } = await request.json();

    if (!cpf || !nome || !empresa || !contrato) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    try {
      await CreateUser(cpf, email, nome, senha, empresa, contrato);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ success: false, error: `Failed to create user: ${error}` }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: `Failed to process request: ${error}` }, { status: 500 });
  }
}


/* delete */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const cpf: string | any = searchParams.get('cpf');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    try {
      console.log(`Deleting user with ID: ${id}`);
      await adminApp.auth().deleteUser(id)
      await deleteUsuario(cpf);

      return NextResponse.json({ success: true, message: `User with ID ${id} deleted successfully` });
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      return NextResponse.json({ success: false, error: `Failed to delete user: ${error}` }, { status: 500 });
    }
  } catch (error) {
    console.error(`Error processing request: ${error}`);
    return NextResponse.json({ success: false, error: `Failed to process request: ${error}` }, { status: 500 });
  }
}
