import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentReference,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Project } from '@/types/project';

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Create a new project
export async function createProject(userId: string, project: Omit<Project, 'id'>) {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...project,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return {
      id: docRef.id,
      ...project,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Get all projects for a user
export async function getUserProjects(userId: string) {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
}

// Update a project
export async function updateProject(projectId: string, updates: Partial<Project>) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(projectId: string) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Get a single project by ID
export async function getProject(projectId: string) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    
    return {
      id: projectDoc.id,
      ...projectDoc.data(),
    } as Project;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}
