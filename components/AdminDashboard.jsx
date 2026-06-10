"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Folder,
    Award,
    Briefcase,
    Wrench,
    Mail,
    LogOut,
    Plus,
    Edit2,
    Trash2,
    Loader2,
    Check,
    X,
    User,
    ChevronRight,
    Upload
} from "lucide-react";
import {
    getCurrentUser,
    signOut,
    uploadFile,
    getProjects,
    getCertificates,
    getExperiences,
    getSkills,
    getMessages,
    createProject,
    updateProject,
    deleteProject,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    createExperience,
    updateExperience,
    deleteExperience,
    createSkill,
    updateSkill,
    deleteSkill,
    deleteMessage,
} from "@/lib/supabase-api";
import "@/lib/css/admin.css";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("projects");

    // Data lists
    const [projects, setProjects] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [skills, setSkills] = useState([]);
    const [messages, setMessages] = useState([]);

    // Modal & Form states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // create | edit
    const [selectedItem, setSelectedItem] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // Upload image preview helper (single image for projects/certificates)
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Multi-image upload for experiences
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    // Dynamic Form Data (Project, Certificate, Experience, Skill)
    const [formData, setFormData] = useState({});

    // Auth validation on mount
    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                if (!u) {
                    router.push("/admin/login");
                    return;
                }
                setUser(u);
                setLoading(false);
                fetchData();
            })
            .catch(() => {
                router.push("/admin/login");
            });
    }, [router]);

    const fetchData = async () => {
        try {
            const [proj, cert, exp, sk, msg] = await Promise.all([
                getProjects(),
                getCertificates(),
                getExperiences(),
                getSkills(),
                getMessages(),
            ]);
            setProjects(proj);
            setCertificates(cert);
            setExperiences(exp);
            setSkills(sk);
            setMessages(msg);
        } catch (err) {
            console.error("Error loading dashboard data:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/admin/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Open Creation Modal
    const openCreateModal = () => {
        setModalMode("create");
        setSelectedItem(null);
        setImageFile(null);
        setImagePreview(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setFormError(null);

        // Initialize fields based on tab
        if (activeTab === "projects") {
            setFormData({ title: "", description: "", stack: "", github: "", demo: "", color: "emerald" });
        } else if (activeTab === "certificates") {
            setFormData({ title: "", issuer: "", date: "", credential: "", skills: "", verify_url: "", category: "Frontend" });
        } else if (activeTab === "experiences") {
            setFormData({ title: "", company: "", location: "", duration: "", description: "", stack: "", current: false });
        } else if (activeTab === "skills") {
            setFormData({ name: "", slug: "", category: "Frontend", lucide_icon: "", order: "" });
        }
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (item) => {
        setModalMode("edit");
        setSelectedItem(item);
        setImageFile(null);
        setImagePreview(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setFormError(null);

        // Populate fields
        if (activeTab === "projects") {
            setFormData({
                title: item.title,
                description: item.description,
                stack: Array.isArray(item.tags) ? item.tags.join(", ") : "",
                github: item.github || "",
                demo: item.live_url || "",
                thumbnail: item.thumbnail || ""
            });
            setImagePreview(item.thumbnail);
        } else if (activeTab === "certificates") {
            setFormData({
                title: item.title,
                issuer: item.issuer,
                date: item.date,
                credential: item.credential_id || "",
                skills: Array.isArray(item.tags) ? item.tags.join(", ") : "",
                verify_url: item.verify_url || "",
                category: item.category || "Frontend",
                image: item.image || ""
            });
            setImagePreview(item.image);
        } else if (activeTab === "experiences") {
            setFormData({
                title: item.title,
                company: item.company,
                location: item.location || "",
                duration: item.duration || "",
                description: item.description,
                stack: Array.isArray(item.tags) ? item.tags.join(", ") : "",
                current: item.current === true
            });
            const imgs = Array.isArray(item.images) ? item.images : [];
            setExistingImages(imgs);
        } else if (activeTab === "skills") {
            setFormData({
                name: item.name,
                slug: item.slug || "",
                category: item.category || "Frontend",
                lucide_icon: item.lucide_icon || "",
                order: item.order || ""
            });
        }
        setShowModal(true);
    };

    // Handle inputs
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Handle files (single image for projects/certificates)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle multiple files (for experiences)
    const handleMultiFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeNewImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Submit form handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        try {
            // Build clean data object for Supabase
            const data = {};

            if (activeTab === "projects") {
                data.title = formData.title;
                data.description = formData.description;
                data.github = formData.github || "";
                data.live_url = formData.demo || "";
                if (formData.stack) {
                    data.tags = formData.stack.split(",").map(s => s.trim()).filter(s => s);
                }
                // Upload thumbnail if file selected
                if (imageFile) {
                    data.thumbnail = await uploadFile(imageFile, "projects");
                } else {
                    data.thumbnail = formData.thumbnail || "";
                }
            }

            if (activeTab === "certificates") {
                data.title = formData.title;
                data.issuer = formData.issuer;
                data.date = formData.date;
                data.credential_id = formData.credential || "";
                data.verify_url = formData.verify_url || "";
                data.category = formData.category || "";
                if (formData.skills) {
                    data.tags = formData.skills.split(",").map(s => s.trim()).filter(s => s);
                }
                // Upload image if file selected
                if (imageFile) {
                    data.image = await uploadFile(imageFile, "certificates");
                } else {
                    data.image = formData.image || "";
                }
            }

            if (activeTab === "experiences") {
                data.title = formData.title;
                data.company = formData.company;
                data.description = formData.description;
                data.location = formData.location || "";
                data.duration = formData.duration || "";
                data.current = formData.current || false;
                if (formData.stack) {
                    data.tags = formData.stack.split(",").map(s => s.trim()).filter(s => s);
                }
                // Upload new images if selected
                if (imageFiles.length > 0) {
                    const uploadedUrls = [];
                    for (const file of imageFiles) {
                        const url = await uploadFile(file, "experiences");
                        uploadedUrls.push(url);
                    }
                    data.images = [...existingImages, ...uploadedUrls];
                } else {
                    data.images = existingImages;
                }
            }

            if (activeTab === "skills") {
                data.name = formData.name;
                data.slug = formData.slug || "";
                data.category = formData.category || "";
                data.lucide_icon = formData.lucide_icon || "";
            }

            if (modalMode === "create") {
                if (activeTab === "projects") await createProject(data);
                else if (activeTab === "certificates") await createCertificate(data);
                else if (activeTab === "experiences") await createExperience(data);
                else if (activeTab === "skills") await createSkill(data);
            } else {
                if (activeTab === "projects") await updateProject(selectedItem.id, data);
                else if (activeTab === "certificates") await updateCertificate(selectedItem.id, data);
                else if (activeTab === "experiences") await updateExperience(selectedItem.id, data);
                else if (activeTab === "skills") await updateSkill(selectedItem.id, data);
            }

            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Submit error:", err);
            const msg = err.message || "Failed to save record. Validate fields.";
            setFormError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    // Delete record handler
    const handleDeleteRecord = async (id) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            if (activeTab === "projects") await deleteProject(id);
            else if (activeTab === "certificates") await deleteCertificate(id);
            else if (activeTab === "experiences") await deleteExperience(id);
            else if (activeTab === "skills") await deleteSkill(id);
            else if (activeTab === "messages") await deleteMessage(id);
            fetchData();
        } catch (err) {
            console.error("Delete record error:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-3">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
                <p className="text-zinc-500 text-sm font-medium tracking-wide">Validating session...</p>
            </div>
        );
    }

    // Sidebar tab config
    const tabs = [
        { id: "projects", label: "Projects", icon: Folder, count: projects.length },
        { id: "certificates", label: "Certificates", icon: Award, count: certificates.length },
        { id: "experiences", label: "Experience", icon: Briefcase, count: experiences.length },
        { id: "skills", label: "Skills", icon: Wrench, count: skills.length },
        { id: "messages", label: "Messages", icon: Mail, count: messages.length },
    ];

    return (
        <div className="admin-shell">
            {/* Ambient Glows */}
            <div className="admin-glow admin-glow--top-right" />
            <div className="admin-glow admin-glow--bottom-left" />

            {/* ==================== SIDEBAR ==================== */}
            <aside className="admin-sidebar">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm tracking-wide">
                            DA
                        </div>
                        <span className="font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Admin Dashboard
                        </span>
                    </div>
                </div>

                <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 bg-white/[0.01]">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                        <User size={15} className="text-emerald-300" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <nav className="admin-nav">
                    {tabs.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
                            >
                                <Icon size={18} className="admin-nav-icon" />
                                <span className="admin-nav-text">{item.label}</span>
                                <span className="admin-nav-badge">
                                    {item.count}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 transition"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ==================== MAIN CONTENT ==================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* Header Controls */}
                    <div className="admin-header">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                <span>Overview</span>
                                <ChevronRight size={10} />
                                <span className="text-cyan-400">{activeTab}</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white mt-1 capitalize">
                                Manage {activeTab}
                            </h1>
                        </div>

                        {activeTab !== "messages" && (
                            <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
                                <Plus size={16} />
                                <span>Add {activeTab.slice(0, -1)}</span>
                            </button>
                        )}
                    </div>

                    {/* ==================== LIST RENDERING ==================== */}

                    {/* --- PROJECTS --- */}
                    {activeTab === "projects" && (
                        <div className="admin-list">
                            {projects.map((p) => (
                                <div key={p.id} className="admin-card-glass admin-card-glass--row">
                                    <div className="admin-card__body">
                                        <div className="admin-card__thumb">
                                            {p.image_path ? (
                                                <img src={p.image_path} alt="" />
                                            ) : (
                                                <Folder size={24} className="text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="admin-card__text">
                                            <h3 className="admin-card__title">{p.title}</h3>
                                            <p className="admin-card__desc">{p.description}</p>
                                            <div className="admin-card__tags">
                                                {Array.isArray(p.stack) && p.stack.map((t) => (
                                                    <span key={t} className="admin-tag">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-card__meta">
                                        <div className="admin-card__links">
                                            {p.github && (
                                                <div className="admin-truncate">
                                                    <span className="text-zinc-400 font-semibold">GitHub:</span>{" "}
                                                    <a href={p.github} target="_blank" rel="noopener noreferrer">
                                                        {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                                                    </a>
                                                </div>
                                            )}
                                            {p.live_url && (
                                                <div className="admin-truncate">
                                                    <span className="text-zinc-400 font-semibold">Live:</span>{" "}
                                                    <a href={p.live_url} target="_blank" rel="noopener noreferrer">
                                                        {p.live_url.replace(/^https?:\/\/(www\.)?/, "")}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="admin-actions">
                                            <button onClick={() => openEditModal(p)} className="admin-btn">
                                                <Edit2 size={14} />
                                                <span>Edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteRecord(p.id)} className="admin-btn admin-btn-danger">
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="admin-empty">No projects found. Create one to get started.</div>
                            )}
                        </div>
                    )}

                    {/* --- CERTIFICATES --- */}
                    {activeTab === "certificates" && (
                        <div className="admin-list">
                            {certificates.map((c) => (
                                <div key={c.id} className="admin-card-glass admin-card-glass--row">
                                    <div className="admin-card__body">
                                        <div className="admin-card__thumb">
                                            {c.image_path ? (
                                                <img src={c.image_path} alt="" />
                                            ) : (
                                                <Award size={24} className="text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="admin-card__text">
                                            <div className="flex flex-wrap items-center gap-2.5 mb-1">
                                                <h3 className="admin-card__title" style={{ marginBottom: 0 }}>{c.title}</h3>
                                                <span className="admin-badge admin-badge--cyan">{c.category}</span>
                                            </div>
                                            <p className="admin-card__subtitle">
                                                {c.issuer} &bull; <span>{c.date}</span>
                                            </p>
                                            {c.credential && (
                                                <p className="admin-mono admin-text-xs admin-text-muted" style={{ marginBottom: '0.25rem' }}>
                                                    Credential ID: <span className="text-zinc-400">{c.credential}</span>
                                                </p>
                                            )}
                                            <div className="admin-card__tags">
                                                {Array.isArray(c.skills) && c.skills.map((t) => (
                                                    <span key={t} className="admin-tag">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-card__meta">
                                        {c.verify_url ? (
                                            <div className="admin-card__links">
                                                <div className="admin-truncate">
                                                    <span className="text-zinc-400 font-semibold">Verify:</span>{" "}
                                                    <a href={c.verify_url} target="_blank" rel="noopener noreferrer">
                                                        {c.verify_url.replace(/^https?:\/\/(www\.)?/, "")}
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="admin-card__links">
                                                <span className="text-zinc-600">No verify URL</span>
                                            </div>
                                        )}
                                        <div className="admin-actions">
                                            <button onClick={() => openEditModal(c)} className="admin-btn">
                                                <Edit2 size={14} />
                                                <span>Edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteRecord(c.id)} className="admin-btn admin-btn-danger">
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {certificates.length === 0 && (
                                <div className="admin-empty">No certificates found. Add one to start.</div>
                            )}
                        </div>
                    )}

                    {/* --- EXPERIENCES --- */}
                    {activeTab === "experiences" && (
                        <div className="admin-list">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="admin-card-glass admin-card-glass--row">
                                    <div className="admin-card__body">
                                        <div className="admin-card__thumb">
                                            {Array.isArray(exp.images) && exp.images.length > 0 ? (
                                                <img src={exp.images[0]} alt="" />
                                            ) : (
                                                <Briefcase size={24} className="text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="admin-card__text">
                                            <div className="flex flex-wrap items-center gap-2.5 mb-1">
                                                <h3 className="admin-card__title" style={{ marginBottom: 0 }}>{exp.title}</h3>
                                                {(exp.current === 1 || exp.current === true) && (
                                                    <span className="admin-badge admin-badge--emerald">Current Role</span>
                                                )}
                                            </div>
                                            <p className="admin-card__subtitle">
                                                {exp.company} &bull; <span>{exp.location}</span>
                                            </p>
                                            <p className="admin-card__desc admin-card__desc--3lines">{exp.description}</p>
                                            <div className="admin-card__tags">
                                                {Array.isArray(exp.stack) && exp.stack.map((t) => (
                                                    <span key={t} className="admin-tag">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-card__meta">
                                        <div className="admin-actions">
                                            <button onClick={() => openEditModal(exp)} className="admin-btn">
                                                <Edit2 size={14} />
                                                <span>Edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteRecord(exp.id)} className="admin-btn admin-btn-danger">
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {experiences.length === 0 && (
                                <div className="admin-empty">No experiences found. Add one to display career history.</div>
                            )}
                        </div>
                    )}

                    {/* --- SKILLS --- */}
                    {activeTab === "skills" && (
                        <div className="admin-skill-grid">
                            {skills.map((s) => (
                                <div key={s.id} className="admin-skill-card">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="admin-badge admin-badge--sky">{s.category}</span>
                                            {s.order !== null && s.order !== undefined && (
                                                <span className="admin-mono admin-text-xs admin-text-muted">Order: {s.order}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="admin-skill-card__icon">
                                                {s.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-white text-base truncate">
                                                    {s.name}
                                                </h4>
                                                <p className="admin-mono admin-text-xs admin-text-muted truncate mt-0.5">
                                                    Slug: {s.slug || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-actions" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => openEditModal(s)} className="admin-btn admin-btn--sm" style={{ flex: 1 }}>
                                            <Edit2 size={12} />
                                            <span>Edit</span>
                                        </button>
                                        <button onClick={() => handleDeleteRecord(s.id)} className="admin-btn admin-btn--sm admin-btn-danger" style={{ flex: 1 }}>
                                            <Trash2 size={12} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {skills.length === 0 && (
                                <div className="admin-empty" style={{ gridColumn: '1 / -1' }}>
                                    No skills found. Add your tech stack to showcase.
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- MESSAGES --- */}
                    {activeTab === "messages" && (
                        <div className="admin-list">
                            {messages.map((m) => (
                                <div key={m.id} className="admin-msg-card">
                                    <div className="admin-msg-card__header">
                                        <div className="min-w-0">
                                            <span className="admin-text-xs admin-text-muted font-bold uppercase tracking-widest">From Sender</span>
                                            <h4 className="font-extrabold text-white text-base truncate mt-0.5">
                                                {m.email}
                                            </h4>
                                        </div>
                                        <span className="admin-mono admin-text-xs admin-text-muted">
                                            {new Date(m.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="admin-msg-card__body">{m.message}</p>
                                    <div className="flex justify-end mt-1">
                                        <button onClick={() => handleDeleteRecord(m.id)} className="admin-btn admin-btn-danger admin-btn--sm">
                                            <Trash2 size={13} />
                                            <span>Delete Message</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="admin-empty">No messages received yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ==================== CREATE/EDIT MODAL ==================== */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal__gradient" aria-hidden />
                        
                        <div className="admin-modal__inner">
                            {/* Header — fixed, never shrinks */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                                <h3 className="text-lg font-bold tracking-tight text-white capitalize">
                                    {modalMode === "create" ? "Add New" : "Edit"} {activeTab.slice(0, -1)}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition">
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Scrollable body */}
                            <div className="admin-modal__scroll">

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {formError && (
                                    <div className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2">
                                        <span>{formError}</span>
                                    </div>
                                )}

                                {/* PROJECT FORM FIELDS */}
                                {activeTab === "projects" && (
                                    <>
                                        <div className="admin-form-grid">
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Project Title</label>
                                                <input type="text" name="title" required className="admin-input" value={formData.title} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Description</label>
                                                <textarea name="description" required rows={3} className="admin-input" value={formData.description} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Tech Stack (comma‑separated)</label>
                                                <input type="text" name="stack" placeholder="React, Laravel, Tailwind" className="admin-input" value={formData.stack} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">GitHub URL</label>
                                                <input type="url" name="github" className="admin-input" value={formData.github} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Demo URL</label>
                                                <input type="url" name="demo" className="admin-input" value={formData.demo} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Accent Color Class</label>
                                                <select name="color" className="admin-input" value={formData.color} onChange={handleInputChange}>
                                                    <option value="violet">Violet</option>
                                                    <option value="indigo">Indigo</option>
                                                    <option value="sky">Sky</option>
                                                    <option value="rose">Rose</option>
                                                    <option value="amber">Amber</option>
                                                    <option value="emerald">Emerald</option>
                                                </select>
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Thumbnail Image</label>
                                                <label className="admin-file-label">
                                                    <Upload size={14} />
                                                    <span>Choose File</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* CERTIFICATE FORM FIELDS */}
                                {activeTab === "certificates" && (
                                    <>
                                        <div className="admin-form-grid">
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Certificate Title</label>
                                                <input type="text" name="title" required className="admin-input" value={formData.title} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Issuer Agency</label>
                                                <input type="text" name="issuer" required className="admin-input" value={formData.issuer} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Issue Date</label>
                                                <input type="text" name="date" required placeholder="May 2026" className="admin-input" value={formData.date} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Credential ID</label>
                                                <input type="text" name="credential" className="admin-input" value={formData.credential} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Verification URL</label>
                                                <input type="url" name="verify_url" className="admin-input" value={formData.verify_url} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Skills Learned (comma‑separated)</label>
                                                <input type="text" name="skills" placeholder="PHP, Security, REST" className="admin-input" value={formData.skills} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Category</label>
                                                <select name="category" className="admin-input" value={["Frontend", "Backend", "UI/UX", "DevOps", "Mobile"].includes(formData.category) ? formData.category : "Other"} onChange={handleInputChange}>
                                                    <option value="Frontend">Frontend</option>
                                                    <option value="Backend">Backend</option>
                                                    <option value="UI/UX">UI/UX</option>
                                                    <option value="DevOps">DevOps</option>
                                                    <option value="Mobile">Mobile</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {!["Frontend", "Backend", "UI/UX", "DevOps", "Mobile"].includes(formData.category) && (
                                                    <input
                                                        type="text"
                                                        placeholder="Type your category..."
                                                        className="admin-input"
                                                        style={{ marginTop: 8 }}
                                                        value={formData.category === "Other" ? "" : formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Certificate Image</label>
                                                <label className="admin-file-label">
                                                    <Upload size={14} />
                                                    <span>Choose File</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* EXPERIENCE FORM FIELDS */}
                                {activeTab === "experiences" && (
                                    <>
                                        <div className="admin-form-grid">
                                            <div className="admin-field">
                                                <label className="admin-label">Job Title</label>
                                                <input type="text" name="title" required className="admin-input" value={formData.title} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Company Name</label>
                                                <input type="text" name="company" required className="admin-input" value={formData.company} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Location</label>
                                                <input type="text" name="location" required placeholder="Jakarta, Remote" className="admin-input" value={formData.location} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Duration Text</label>
                                                <input type="text" name="duration" required placeholder="Jan 2024 – Present" className="admin-input" value={formData.duration} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Job Description</label>
                                                <textarea name="description" required rows={3} className="admin-input" value={formData.description} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Stack Tags (comma‑separated)</label>
                                                <input type="text" name="stack" placeholder="PHP, Docker, git" className="admin-input" value={formData.stack} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                                    <input type="checkbox" id="current" name="current" className="h-4 w-4 bg-zinc-900 border border-white/10 text-emerald-600 rounded focus:ring-emerald-500" checked={formData.current} onChange={handleInputChange} />
                                                    <label htmlFor="current" className="text-xs text-zinc-300 font-semibold cursor-pointer select-none">I currently work here</label>
                                                </div>
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Experience Photos (multiple allowed)</label>
                                                <label className="admin-file-label">
                                                    <Upload size={14} />
                                                    <span>Choose Files</span>
                                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFileChange} />
                                                </label>
                                            </div>
                                        </div>
                                        {/* Multi-image previews */}
                                        {(existingImages.length > 0 || imagePreviews.length > 0) && (
                                            <div className="admin-field">
                                                <label className="admin-label admin-text-muted">Image Previews</label>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {existingImages.map((url, i) => (
                                                        <div key={`existing-${i}`} className="h-20 w-28 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden relative group">
                                                            <img src={url} alt="" className="h-full w-full object-cover" />
                                                            <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition font-bold text-xs">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {imagePreviews.map((url, i) => (
                                                        <div key={`new-${i}`} className="h-20 w-28 rounded-lg bg-zinc-900 border border-emerald-500/20 overflow-hidden relative group">
                                                            <img src={url} alt="" className="h-full w-full object-cover" />
                                                            <button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition font-bold text-xs">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* SKILL FORM FIELDS */}
                                {activeTab === "skills" && (
                                    <>
                                        <div className="admin-form-grid">
                                            <div className="admin-field">
                                                <label className="admin-label">Skill Name</label>
                                                <input type="text" name="name" required className="admin-input" value={formData.name} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">SVG Brand Slug</label>
                                                <input type="text" name="slug" placeholder="laravel" className="admin-input" value={formData.slug} onChange={handleInputChange} />
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Category Group</label>
                                                <select name="category" className="admin-input" value={formData.category} onChange={handleInputChange}>
                                                    <option value="Frontend">Frontend</option>
                                                    <option value="Backend">Backend</option>
                                                    <option value="Tools">Tools</option>
                                                    <option value="Design">Design</option>
                                                </select>
                                            </div>
                                            <div className="admin-field">
                                                <label className="admin-label">Lucide Icon Fallback</label>
                                                <select name="lucide_icon" className="admin-input" value={formData.lucide_icon} onChange={handleInputChange}>
                                                    <option value="">None (Slug Image)</option>
                                                    <option value="Webhook">Webhook</option>
                                                    <option value="PenTool">PenTool</option>
                                                    <option value="LayoutTemplate">LayoutTemplate</option>
                                                    <option value="Layers">Layers</option>
                                                    <option value="Type">Type</option>
                                                    <option value="Pipette">Pipette</option>
                                                </select>
                                            </div>
                                            <div className="admin-field admin-field--full">
                                                <label className="admin-label">Order Priority</label>
                                                <input type="number" name="order" placeholder="1" className="admin-input" value={formData.order} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Image Preview row (single image - projects/certificates) */}
                                {imagePreview && (activeTab === "projects" || activeTab === "certificates") && (
                                    <div className="admin-field">
                                        <label className="admin-label admin-text-muted">Image Preview</label>
                                        <div className="h-28 w-44 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden relative group">
                                            <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition font-bold text-xs">
                                                Remove Image
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="admin-btn">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={formLoading} className="admin-btn admin-btn-primary">
                                        {formLoading ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Check size={15} />
                                        )}
                                        <span>{formLoading ? "Saving..." : "Save Record"}</span>
                                    </button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
