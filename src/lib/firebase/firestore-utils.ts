import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentReference as FirestoreDocumentReference,
} from 'firebase/firestore';
import {
  UserProfile,
  Project,
  DocumentReference,
  Transaction,
  Task,
  Comment,
  Milestone,
} from './firestore-types';

// User Profile Functions
export async function createUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  const timestamp = Timestamp.now();
  await updateDoc(userRef, {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Project Functions
export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const projectRef = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return projectRef.id;
}

export async function getProject(projectId: string) {
  const projectRef = doc(db, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);
  return projectDoc.exists() ? { id: projectDoc.id, ...projectDoc.data() } as Project : null;
}

export async function getUserProjects(userId: string) {
  const q = query(
    collection(db, 'projects'),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(projectId: string) {
  await deleteDoc(doc(db, 'projects', projectId));
}

// Document Functions
export async function addDocument(data: Omit<DocumentReference, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(db, 'documents'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
}

export async function getProjectDocuments(projectId: string) {
  const q = query(
    collection(db, 'documents'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as DocumentReference);
}

// Transaction Functions
export async function addTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const transactionRef = await addDoc(collection(db, 'transactions'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return transactionRef.id;
}

export async function getProjectTransactions(projectId: string) {
  const q = query(
    collection(db, 'transactions'),
    where('projectId', '==', projectId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Transaction);
}

// Task Functions
export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const taskRef = await addDoc(collection(db, 'tasks'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return taskRef.id;
}

export async function getProjectTasks(projectId: string) {
  const q = query(
    collection(db, 'tasks'),
    where('projectId', '==', projectId),
    orderBy('dueDate', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Comment Functions
export async function addComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const commentRef = await addDoc(collection(db, 'comments'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return commentRef.id;
}

export async function getProjectComments(projectId: string) {
  const q = query(
    collection(db, 'comments'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Comment);
}

// Milestone Functions
export async function createMilestone(data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Timestamp.now();
  const milestoneRef = await addDoc(collection(db, 'milestones'), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return milestoneRef.id;
}

export async function getProjectMilestones(projectId: string) {
  const q = query(
    collection(db, 'milestones'),
    where('projectId', '==', projectId),
    orderBy('dueDate', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Milestone);
}

export async function updateMilestone(milestoneId: string, data: Partial<Milestone>) {
  const milestoneRef = doc(db, 'milestones', milestoneId);
  await updateDoc(milestoneRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
} 