import admin from 'firebase-admin';

let adminApp: admin.app.App;

export const initAdminApp = async () => {
  if (!adminApp) {
    adminApp = await initAdmin();
  }
};

interface FirebaseAdmin {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

export async function getUserUidByEmail(email: string): Promise<string | null> {
  try {
    if (!adminApp) {
      throw new Error("Firebase admin app is not initialized");
    }
    console.log("Fetching user by email:", email);
    const userRecord = await adminApp.auth().getUserByEmail(email);
    console.log("User record found:", userRecord);
    return await userRecord.uid;
  } catch (error) {
    console.error(`Error getting user by email: ${error}`);
    return null;
  }
}


export async function deleteUID(uid: string) {
  try {
    await adminApp.auth().deleteUser(uid);
    console.log(`Usuário ${uid} deletado com sucesso`);
  } catch (error) {
    throw new Error(`Erro ao deletar usuário: ${error}`);
  }
}

export async function eraserUser(uid: string) {
  try {
    await deleteUID(uid);
  } catch (error) {
    console.error(`Erro ao apagar usuário: ${error}`);
  }
}


function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdmin) {
  const privateKey = formatPrivateKey(params.privateKey);
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}
//para fazer o build
export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  };
  return createFirebaseAdminApp(params);
}


