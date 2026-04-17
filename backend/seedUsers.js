const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Admin = require("./models/adminSchema.js");
const Student = require("./models/studentSchema.js");
const Teacher = require("./models/teacherSchema.js");
const Sclass = require("./models/sclassSchema.js");

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Clear existing data (optional - remove if you want to keep existing data)
        await Admin.deleteOne({ email: "yogendra@12" });
        await Student.deleteOne({ rollNum: "1" });
        await Teacher.deleteOne({ email: "tony@12" });
        await Sclass.deleteOne({ sclassName: "Class 10" });
        console.log("Cleared existing demo data");

        // Create Admin
        const admin = new Admin({
            name: "Yogendra Admin",
            email: "yogendra@12",
            password: "zxc",
            role: "Admin",
            schoolName: "Demo School"
        });
        await admin.save();
        console.log("✅ Admin created: yogendra@12 / zxc");

        // Create Class first (needed for student)
        const sclass = new Sclass({
            sclassName: "Class 10",
            school: admin._id
        });
        await sclass.save();
        console.log("✅ Class created: Class 10");

        // Create Student
        const student = new Student({
            name: "Dipesh Awasthi",
            rollNum: "1",
            password: "zxc",
            sclassName: sclass._id,
            school: admin._id,
            role: "Student",
            attendance: []
        });
        await student.save();
        console.log("✅ Student created: Roll 1 / Dipesh Awasthi / zxc");

        // Create Teacher
        const teacher = new Teacher({
            name: "Tony Teacher",
            email: "tony@12",
            password: "zxc",
            school: admin._id,
            role: "Teacher",
            teachSclass: sclass._id
        });
        await teacher.save();
        console.log("✅ Teacher created: tony@12 / zxc");

        console.log("\n🎉 All demo users created successfully!");
        console.log("\n--- Login Credentials ---");
        console.log("Admin:    yogendra@12 / zxc");
        console.log("Student:  Roll: 1, Name: Dipesh Awasthi / zxc");
        console.log("Teacher:  tony@12 / zxc");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
