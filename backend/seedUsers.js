const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const Admin = require("./models/adminSchema.js");
const Student = require("./models/studentSchema.js");
const Teacher = require("./models/teacherSchema.js");
const Sclass = require("./models/sclassSchema.js");
const Subject = require("./models/subjectSchema.js");

dotenv.config();

// Helper: random integer between min and max (inclusive)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: random date in the past N days
const randomDate = (daysBack) => {
    const date = new Date();
    date.setDate(date.getDate() - randInt(1, daysBack));
    date.setHours(0, 0, 0, 0);
    return date;
};

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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123", salt);

        const admin = new Admin({
            name: "Admin",
            email: "admin231",
            password: hashedPassword,
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
        console.log(`✅ ${classes.length} Classes created`);

        // ==================== SUBJECTS (5 per class) ====================
        const baseSubjects = [
            { subName: "Mathematics", subCode: "MATH" },
            { subName: "Science", subCode: "SCI" },
            { subName: "English", subCode: "ENG" },
            { subName: "Hindi", subCode: "HIN" },
            { subName: "Social Studies", subCode: "SST" },
        ];

        const sessionsPerSubject = { "Mathematics": "5", "Science": "5", "English": "4", "Hindi": "4", "Social Studies": "4" };

        // allSubjects[classIdx] = array of 5 subject documents for that class
        const allSubjects = [];

        for (let i = 0; i < classNames.length; i++) {
            const classSubjects = [];
            for (const baseSub of baseSubjects) {
                const subject = new Subject({
                    subName: baseSub.subName,
                    subCode: `${baseSub.subCode}${i + 6}`, // e.g., MATH6, SCI7
                    sessions: sessionsPerSubject[baseSub.subName],
                    sclassName: classes[i]._id,
                    school: admin._id
                });
                await subject.save();
                classSubjects.push(subject);
            }
            allSubjects.push(classSubjects);
        }
        console.log(`✅ ${classNames.length * 5} Subjects created (5 per class)`);

        // ==================== TEACHERS (5 total, 1 per class) ====================
        const teacherData = [
            { name: "Rajesh Kumar", email: "rajesh@school.com" },
            { name: "Priya Sharma", email: "priya@school.com" },
            { name: "Anil Verma", email: "anil@school.com" },
            { name: "Sunita Devi", email: "sunita@school.com" },
            { name: "Vikram Singh", email: "vikram@school.com" },
        ];

        const teachers = [];
        for (let i = 0; i < teacherData.length; i++) {
            const teacherSalt = await bcrypt.genSalt(10);
            const teacherHashedPass = await bcrypt.hash("123", teacherSalt);
            const teacher = new Teacher({
                name: teacherData[i].name,
                email: teacherData[i].email,
                password: teacherHashedPass,
                school: admin._id,
                role: "Teacher",
                teachSclass: classes[i]._id,
                teachSubject: allSubjects[i][0]._id // First subject of their class
            });
            await teacher.save();
            teachers.push(teacher);
        }

        // Update subjects with teacher references (first subject of each class gets the teacher)
        for (let i = 0; i < teachers.length; i++) {
            allSubjects[i][0].teacher = teachers[i]._id;
            await allSubjects[i][0].save();
        }
        console.log(`✅ ${teachers.length} Teachers created`);

        // ==================== STUDENTS (5 per class) ====================
        const studentNamesByClass = [
            ["Aarav Patel", "Ananya Gupta", "Arjun Reddy", "Diya Sharma", "Ishaan Mehta"],
            ["Kavya Nair", "Rohan Joshi", "Meera Iyer", "Aditya Singh", "Nisha Rao"],
            ["Vivek Das", "Pooja Mukherjee", "Rahul Kulkarni", "Sneha Pillai", "Arnav Chauhan"],
            ["Divya Bansal", "Kunal Thakur", "Riya Agarwal", "Sahil Negi", "Tanvi Bhatt"],
            ["Neha Saxena", "Aman Tiwari", "Prachi Dubey", "Yash Mishra", "Simran Kaur"],
        ];

        const allStudents = [];
        for (let classIdx = 0; classIdx < studentNamesByClass.length; classIdx++) {
            const studentNames = studentNamesByClass[classIdx];
            const classSubjects = allSubjects[classIdx];

            for (let j = 0; j < studentNames.length; j++) {
                const rollNum = classIdx * 5 + j + 1;
                const studentSalt = await bcrypt.genSalt(10);
                const studentHashedPass = await bcrypt.hash("123", studentSalt);

                // ---- Exam Results: marks for each subject ----
                const examResult = classSubjects.map(subject => ({
                    subName: subject._id,
                    marksObtained: randInt(45, 98) // Random marks out of 100
                }));

                // ---- Attendance: records for last 30 days for each subject ----
                const attendance = [];
                for (const subject of classSubjects) {
                    const sessionsCount = parseInt(subject.sessions);
                    // Add attendance records (up to sessions count)
                    for (let s = 0; s < Math.min(sessionsCount, 4); s++) {
                        attendance.push({
                            date: randomDate(30),
                            status: Math.random() > 0.15 ? "Present" : "Absent", // 85% attendance
                            subName: subject._id
                        });
                    }
                }

                const student = new Student({
                    name: studentNames[j],
                    rollNum: rollNum,
                    password: studentHashedPass,
                    sclassName: classes[classIdx]._id,
                    school: admin._id,
                    role: "Student",
                    examResult,
                    attendance
                });
                await student.save();
                allStudents.push(student);
            }
        }
        console.log(`✅ ${allStudents.length} Students created with exam results and attendance`);

        // ==================== SUMMARY ====================
        console.log("\n🎉 All dummy data created successfully!");
        console.log("\n========================================");
        console.log("         LOGIN CREDENTIALS");
        console.log("========================================");
        console.log("\n👤 Admin:");
        console.log("   Email: admin231 / Password: 123");
        console.log("\n👩‍🏫 Teachers (Password: 123):");
        teacherData.forEach((t, i) => {
            console.log(`   ${t.name} — ${t.email} — Subject: ${baseSubjects[0].subName} — Class: ${classNames[i]}`);
        });
        console.log("\n🎓 Students (Password: 123):");
        studentNamesByClass.forEach((names, classIdx) => {
            console.log(`\n   📚 ${classNames[classIdx]}:`);
            names.forEach((name, j) => {
                const rollNum = classIdx * 5 + j + 1;
                console.log(`      Roll ${rollNum}: ${name}`);
            });
        });
        console.log("\n📊 Each student has:");
        console.log("   - Exam marks (out of 100) for 5 subjects");
        console.log("   - Attendance records (4 sessions per subject, ~85% present)");
        console.log("\n========================================");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
