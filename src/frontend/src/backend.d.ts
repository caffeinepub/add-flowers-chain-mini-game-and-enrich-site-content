import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TestProgress {
    answers: Array<string>;
    completed: boolean;
    testId: string;
}
export type Time = bigint;
export interface Assessment {
    hadScore: bigint;
    patient: Principal;
    copmScore: bigint;
    assessmentDate: Time;
    shuttleWalkScore: bigint;
    videoRecord?: ExternalBlob;
    vitalObservations: string;
    meamsScore: bigint;
}
export interface Affirmation {
    id: bigint;
    text: string;
    author?: string;
}
export interface Patient {
    conditionSummary: string;
    goals: string;
    profile: UserProfile;
    isDischarged: boolean;
}
export interface ProgrammePlan {
    patient: Principal;
    completionStatus: boolean;
    frequency: string;
    interventions: Array<string>;
}
export interface JournalEntry {
    id: bigint;
    title?: string;
    content: string;
    createdAt: Time;
}
export interface NoticeboardPost {
    author: Principal;
    message: string;
    timestamp: Time;
}
export interface CommunityActivity {
    name: string;
    description: string;
    location: string;
}
export interface Appointment {
    patient: Principal;
    isConsultant: boolean;
    time: Time;
    staff: Principal;
    location: string;
}
export interface TestData {
    id: string;
    name: string;
    description: string;
    questions: Array<string>;
}
export interface UserProfile {
    leisureCentreArea: string;
    name: string;
    role: UserRole;
    contactPreferences: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAffirmation(text: string, author: string | null): Promise<void>;
    addAssessment(patient: Principal, vitalObservations: string, hadScore: bigint, meamsScore: bigint, shuttleWalkScore: bigint, copmScore: bigint, assessmentDate: Time, videoRecord: ExternalBlob | null): Promise<void>;
    addCommunityActivity(name: string, location: string, description: string): Promise<void>;
    addNoticeboardPost(message: string): Promise<void>;
    addTest(test: TestData): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookAppointment(patientPrincipal: Principal, staff: Principal, location: string, time: Time, isConsultant: boolean): Promise<void>;
    completeTest(testId: string, answers: Array<string>): Promise<void>;
    createJournalEntry(title: string | null, content: string): Promise<bigint>;
    createProgrammePlan(patient: Principal, interventions: Array<string>, frequency: string): Promise<void>;
    deleteJournalEntry(entryId: bigint): Promise<void>;
    dischargePatient(patientPrincipal: Principal): Promise<void>;
    getAllCommunityActivities(): Promise<Array<CommunityActivity>>;
    getAllJournalEntries(): Promise<Array<JournalEntry>>;
    getAllNoticeboardPosts(): Promise<Array<NoticeboardPost>>;
    getAllTests(): Promise<Array<TestData>>;
    getAllUsersSortedByName(): Promise<Array<UserProfile>>;
    getAppointmentsForPatient(patient: Principal): Promise<Array<Appointment>>;
    getAssessmentsForPatient(patient: Principal): Promise<Array<Assessment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJournalEntry(entryId: bigint): Promise<JournalEntry | null>;
    getPatient(patientPrincipal: Principal): Promise<Patient | null>;
    getProgrammePlansForPatient(patient: Principal): Promise<Array<ProgrammePlan>>;
    getRandomAffirmation(): Promise<Affirmation | null>;
    getUserGrowthSummary(): Promise<{
        streak: bigint;
        completedTests: bigint;
        journalCount: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTestProgress(): Promise<Array<TestProgress>>;
    isCallerAdmin(): Promise<boolean>;
    onboardPatient(conditionSummary: string, goals: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startTest(testId: string): Promise<void>;
    updateProgrammePlanStatus(patient: Principal, isCompleted: boolean): Promise<void>;
}
