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
  getDoc,
  Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Project } from '@/types/project';
import { Property } from '@/types/property';

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

// Project Functions
export async function createProject(userId: string, project: Omit<Project, 'id'>) {
  const projectRef = await addDoc(collection(db, 'projects'), {
    ...project,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    id: projectRef.id,
    ...project
  };
}

export async function getUserProjects(userId: string) {
  const projectsQuery = query(
    collection(db, 'projects'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(projectsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Project[];
}

// Property Functions
export async function createProperty(userId: string, property: Omit<Property, 'id'>) {
  const propertyRef = await addDoc(collection(db, 'properties'), {
    ...property,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    id: propertyRef.id,
    ...property
  };
}

export async function getUserProperties(userId: string) {
  const propertiesQuery = query(
    collection(db, 'properties'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(propertiesQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Property[];
}

// Report Types
export interface Report {
  id: string;
  name: string;
  type: 'Progress' | 'Financial' | 'Summary';
  date: string;
  projectId?: string;
  data: any;
  status: 'Generated' | 'Processing' | 'Failed';
}

// Report Functions
export async function createReport(userId: string, report: Omit<Report, 'id'>) {
  const reportRef = await addDoc(collection(db, 'reports'), {
    ...report,
    userId,
    createdAt: Timestamp.now(),
  });

  return {
    id: reportRef.id,
    ...report
  };
}

export async function getUserReports(userId: string) {
  const reportsQuery = query(
    collection(db, 'reports'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(reportsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Report[];
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
