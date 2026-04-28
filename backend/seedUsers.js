const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Admin = require("./models/adminSchema.js");
const Student = require("./models/studentSchema.js");
const Teacher = require("./models/teacherSchema.js");
const Sclass = require("./models/sclassSchema.js");
const Subject = require("./models/subjectSchema.js");

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Clear ALL existing data
        await Admin.deleteMany({});
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Sclass.deleteMany({});
        await Subject.deleteMany({});
        console.log("Cleared all existing data");

        // ==================== ADMIN ====================
        const admin = new Admin({
            name: "Admin",
            email: "admin231",
            password: "123",
            role: "Admin",
            schoolName: "Delhi Public School"
        });
        await admin.save();
        console.log("✅ Admin created: admin231 / 123");

        // ==================== CLASSES ====================
        const classNames = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
        const classes = [];

        for (const className of classNames) {
            const sclass = new Sclass({
                sclassName: className,
                school: admin._id
            });
            await sclass.save();
            classes.push(sclass);
        }
        console.log(`✅ ${classes.length} Classes created: ${classNames.join(", ")}`);

        // ==================== SUBJECTS ====================
        const subjectData = [
            { subName: "Mathematics", subCode: "MATH01", sessions: "5" },
            { subName: "Science", subCode: "SCI01", sessions: "5" },
            { subName: "English", subCode: "ENG01", sessions: "4" },
            { subName: "Hindi", subCode: "HIN01", sessions: "4" },
            { subName: "Social Studies", subCode: "SST01", sessions: "4" },
        ];

        const subjects = [];
        for (let i = 0; i < subjectData.length; i++) {
            const subject = new Subject({
                ...subjectData[i],
                sclassName: classes[i]._id,
                school: admin._id
            });
            await subject.save();
            subjects.push(subject);
        }
        console.log(`✅ ${subjects.length} Subjects created: ${subjectData.map(s => s.subName).join(", ")}`);

        // ==================== TEACHERS ====================
        const teacherData = [
            { name: "Rajesh Kumar", email: "rajesh@school.com", password: "123" },
            { name: "Priya Sharma", email: "priya@school.com", password: "123" },
            { name: "Anil Verma", email: "anil@school.com", password: "123" },
            { name: "Sunita Devi", email: "sunita@school.com", password: "123" },
            { name: "Vikram Singh", email: "vikram@school.com", password: "123" },
        ];

        const teachers = [];
        for (let i = 0; i < teacherData.length; i++) {
            const teacher = new Teacher({
                ...teacherData[i],
                school: admin._id,
                role: "Teacher",
                teachSclass: classes[i]._id,
                teachSubject: subjects[i]._id
            });
            await teacher.save();
            teachers.push(teacher);
        }

        // Update subjects with teacher references
        for (let i = 0; i < subjects.length; i++) {
            subjects[i].teacher = teachers[i]._id;
            await subjects[i].save();
        }
        console.log(`✅ ${teachers.length} Teachers created: ${teacherData.map(t => t.name).join(", ")}`);

        // ==================== STUDENTS ====================
        // 5 students per class, each class has 1 teacher
        const studentNamesByClass = [
            // Class 6 - Mathematics (Rajesh Kumar)
            ["Aarav Patel", "Ananya Gupta", "Arjun Reddy", "Diya Sharma", "Ishaan Mehta"],
            // Class 7 - Science (Priya Sharma)
            ["Kavya Nair", "Rohan Joshi", "Meera Iyer", "Aditya Singh", "Nisha Rao"],
            // Class 8 - English (Anil Verma)
            ["Vivek Das", "Pooja Mukherjee", "Rahul Kulkarni", "Sneha Pillai", "Arnav Chauhan"],
            // Class 9 - Hindi (Sunita Devi)
            ["Divya Bansal", "Kunal Thakur", "Riya Agarwal", "Sahil Negi", "Tanvi Bhatt"],
            // Class 10 - Social Studies (Vikram Singh)
            ["Neha Saxena", "Aman Tiwari", "Prachi Dubey", "Yash Mishra", "Simran Kaur"],
        ];

        const allStudents = [];
        for (let classIdx = 0; classIdx < studentNamesByClass.length; classIdx++) {
            const studentNames = studentNamesByClass[classIdx];
            for (let j = 0; j < studentNames.length; j++) {
                const rollNum = classIdx * 5 + j + 1;
                const student = new Student({
                    name: studentNames[j],
                    rollNum: rollNum,
                    password: "123",
                    sclassName: classes[classIdx]._id,
                    school: admin._id,
                    role: "Student",
                    examResult: [{
                        subName: subjects[classIdx]._id,
                        marksObtained: Math.floor(Math.random() * 40) + 60 // 60-100
                    }],
                    attendance: []
                });
                await student.save();
                allStudents.push(student);
            }
        }
        console.log(`✅ ${allStudents.length} Students created (5 per class)`);

        // ==================== SUMMARY ====================
        console.log("\n🎉 All dummy data created successfully!");
        console.log("\n========================================");
        console.log("         LOGIN CREDENTIALS");
        console.log("========================================");
        console.log("\n👤 Admin:");
        console.log("   Email: admin231 / Password: 123");
        console.log("\n👩‍🏫 Teachers:");
        teacherData.forEach((t, i) => {
            console.log(`   ${t.name} — Email: ${t.email} / Password: ${t.password} — Subject: ${subjectData[i].subName} — Class: ${classNames[i]}`);
        });
        console.log("\n🎓 Students (Password for all: 123):");
        studentNamesByClass.forEach((names, classIdx) => {
            console.log(`\n   📚 ${classNames[classIdx]} (${subjectData[classIdx].subName} - ${teacherData[classIdx].name}):`);
            names.forEach((name, j) => {
                const rollNum = classIdx * 5 + j + 1;
                console.log(`      Roll ${rollNum}: ${name}`);
            });
        });
        console.log("\n========================================");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
