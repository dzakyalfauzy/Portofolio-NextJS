import { supabase } from "./supabase";

// ============================================
// File Upload to Supabase Storage
// ============================================

export async function uploadFile(file: File, folder: string = "uploads") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ============================================
// Portfolio Data API (Public - Read Only)
// ============================================

export async function getPortfolioData() {
    const [projectsRes, certificatesRes, experiencesRes, skillsRes] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("certificates").select("*").order("created_at", { ascending: false }),
        supabase.from("experiences").select("*").order("created_at", { ascending: false }),
        supabase.from("skills").select("*").order("created_at", { ascending: false }),
    ]);

    return {
        projects: projectsRes.data || [],
        certificates: certificatesRes.data || [],
        experiences: experiencesRes.data || [],
        skills: skillsRes.data || [],
    };
}

export async function getProject(id: string) {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
}

// ============================================
// Contact Form
// ============================================

export async function sendMessage(email: string, message: string) {
    const { error } = await supabase.from("messages").insert({ email, message });
    if (error) throw error;
}

// ============================================
// Admin API (Authenticated)
// ============================================

// Auth
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Projects CRUD
export async function getProjects() {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createProject(project: any) {
    const { data, error } = await supabase.from("projects").insert(project).select().single();
    if (error) throw error;
    return data;
}

export async function updateProject(id: string, project: any) {
    const { data, error } = await supabase.from("projects").update(project).eq("id", id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
}

// Certificates CRUD
export async function getCertificates() {
    const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createCertificate(cert: any) {
    const { data, error } = await supabase.from("certificates").insert(cert).select().single();
    if (error) throw error;
    return data;
}

export async function updateCertificate(id: string, cert: any) {
    const { data, error } = await supabase.from("certificates").update(cert).eq("id", id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteCertificate(id: string) {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) throw error;
}

// Experiences CRUD
export async function getExperiences() {
    const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createExperience(exp: any) {
    const { data, error } = await supabase.from("experiences").insert(exp).select().single();
    if (error) throw error;
    return data;
}

export async function updateExperience(id: string, exp: any) {
    const { data, error } = await supabase.from("experiences").update(exp).eq("id", id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteExperience(id: string) {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
}

// Skills CRUD
export async function getSkills() {
    const { data, error } = await supabase.from("skills").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createSkill(skill: any) {
    const { data, error } = await supabase.from("skills").insert(skill).select().single();
    if (error) throw error;
    return data;
}

export async function updateSkill(id: string, skill: any) {
    const { data, error } = await supabase.from("skills").update(skill).eq("id", id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteSkill(id: string) {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
}

// Messages
export async function getMessages() {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function deleteMessage(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
}
