const mysql = require("mysql2/promise");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://dfuprxqhyvpelekncuzv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdXByeHFoeXZwZWxla25jdXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzc3MDEsImV4cCI6MjA5NjUxMzcwMX0.efXSNm5ljZcFrsK_dELNILJfXuke1uKSVRTtR3OUEtQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function mapRow(row, mapping) {
    const result = {};
    for (const [mysqlCol, supaCol] of Object.entries(mapping)) {
        if (row[mysqlCol] !== undefined && row[mysqlCol] !== null) {
            let val = row[mysqlCol];
            if (typeof val === "string" && (supaCol === "tags" || supaCol === "images")) {
                try { val = JSON.parse(val); } catch {}
            }
            result[supaCol] = val;
        }
    }
    return result;
}

const MAPPINGS = {
    projects: {
        title: "title", description: "description", stack: "tags",
        github: "github", demo: "live_url", image_path: "thumbnail",
    },
    certificates: {
        title: "title", issuer: "issuer", date: "date",
        credential: "credential_id", skills: "tags", category: "category",
        verify_url: "verify_url", image_path: "image",
    },
    experiences: {
        title: "title", company: "company", description: "description",
        stack: "tags", images: "images",
    },
    skills: {
        name: "name", slug: "slug", lucide_icon: "lucide_icon", category: "category",
    },
};

async function migrate() {
    console.log("🚀 Migration: MySQL → Supabase\n");

    const conn = await mysql.createConnection({
        host: "127.0.0.1", port: 3306, user: "root", password: "", database: "db_portofolio",
    });

    for (const [table, mapping] of Object.entries(MAPPINGS)) {
        console.log(`📦 ${table}...`);
        const [rows] = await conn.execute(`SELECT * FROM ${table}`);
        let ok = 0, fail = 0;
        for (const row of rows) {
            const data = mapRow(row, mapping);
            const { error } = await supabase.from(table).insert(data);
            if (error) { console.error(`   ❌ ${data.title || data.name}: ${error.message}`); fail++; }
            else { ok++; }
        }
        console.log(`   ✅ ${ok} inserted, ❌ ${fail} failed\n`);
    }

    await conn.end();
    console.log("🎉 Done!");
}

migrate().catch(console.error);
