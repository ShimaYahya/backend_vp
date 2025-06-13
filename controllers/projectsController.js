var models = require('../models');
var authService = require('../services/auth');
const { Op } = require("sequelize");
const path = require('path');
const fs = require('fs');
var {projectTransformer, projectsTransformer} = require('../transform/projectPhoto');

// عرض جميع المشاريع
exports.index = function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: []
    }
    models.Projects.findAll({
        include: [{
                        model: models.Projects_Categories
                    }, {
                        model: models.Cities,
                        attributes: ['id', 'name']
                    }, {
                        model: models.Countries,
                        attributes: ['id', 'name']
                    }, {
                        model: models.Execution_types,
                        attributes: ['id', 'execution_type']
                    }]
    })
        .then(projects => {
            if (Array.isArray(projects) && projects.length) {
                response.data = projectsTransformer(projects);
                response.success = true;
            } else {
                response.message.push("No projects found");
            }
            res.send(response);
        }).catch(error => {
            console.error(error);
            response.message.push("Error fetching projects");
            res.status(500).send(response);
        });
}

// إضافة مشروع جديد مع صورة
exports.add = async function (req, res, next) {

    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    var response = {
        success: true,
        message: [],
        data: {}
    }
    
    // التحقق من صلاحية الأدمن
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        response.message.push("Authorization token required");
        response.success = false;
        return res.status(401).send(response);
    }
    
    try {
        const isVerified = await authService.verifyAdmin(token);
        if (!isVerified) {
            response.message.push("Unauthorized access");
            response.success = false;
            return res.status(403).send(response);
        }

        // التحقق من الحقول المطلوبة
        const requiredFields = [
            'project_name', 'start_date', 'end_date',
            'country_id', 'city_id', 'deadline'
        ];
        
        const missingFields = [];
        requiredFields.forEach(field => {
            if (!req.body[field]) missingFields.push(field);
        });
        
        if (missingFields.length) {
            response.message.push(`Missing required fields: ${missingFields.join(', ')}`);
            response.success = false;
            return res.status(400).send(response);
        }

        // معالجة الصورة
        let photoPath = null;
        if (req.file) {
            // حفظ الصورة في مجلد uploads
            photoPath =  req.file.filename;
        }

        // إنشاء المشروع
        const newProject = await models.Projects.create({
            project_name: req.body.project_name,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            country_id: req.body.country_id,
            city_id: req.body.city_id,
            description: req.body.description || null,
            project_manager: req.body.project_manager || null,
            contact_person: req.body.contact_person || null,
            contact_phone: req.body.contact_phone || null,
            contact_email: req.body.contact_email || null,
            project_points: req.body.project_points || 0,
            num_voliunteers: req.body.num_voliunteers || 0,
            deadline: req.body.deadline,
            conditions: req.body.conditions || null,
            execution_type_id: req.body.execution_type_id || null,
            available: req.body.available || true,
            photo: photoPath // حفظ مسار الصورة
        });

        console.log("-----------------------------------------",newProject)

        response.data = newProject;
        response.message.push("Project created successfully");
        res.status(201).send(response);
    } catch (error) {
        console.error(error);
        response.success = false;
        response.message.push("Error creating project");
        res.status(500).send(response);
    }
}

// عرض مشروع بواسطة ID
exports.show = async function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    
    const id = req.params.id;
    if (isNaN(id)) {
        response.message.push("Invalid project ID");
        return res.status(400).send(response);
    }

    try {
        const project = await models.Projects.findByPk(id, { include: [{
                        model: models.Projects_Categories
                    }, {
                        model: models.Cities,
                        attributes: ['id', 'name']
                    }, {
                        model: models.Countries,
                        attributes: ['id', 'name']
                    }, {
                        model: models.Execution_types,
                        attributes: ['id', 'execution_type']
                    }]});
        if (project) {
            response.success = true;
            response.data = projectTransformer(project);
            res.send(response);
        } else {
            response.message.push("Project not found");
            res.status(404).send(response);
        }
    } catch (error) {
        console.error(error);
        response.message.push("Error fetching project");
        res.status(500).send(response);
    }
}

// تحديث المشروع مع صورة
exports.update = async function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    
    // التحقق من صلاحية الأدمن
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        response.message.push("Authorization token required");
        return res.status(401).send(response);
    }
    
    try {
        const isVerified = await authService.verifyAdmin(token);
        if (!isVerified) {
            response.message.push("Unauthorized access");
            return res.status(403).send(response);
        }

        const projectId = req.params.id;
        if (isNaN(projectId)) {
            response.message.push("Invalid project ID");
            return res.status(400).send(response);
        }

        const project = await models.Projects.findByPk(projectId);
        if (!project) {
            response.message.push("Project not found");
            return res.status(404).send(response);
        }

        // تحديث الحقول المسموح بها
        const updatableFields = [
            'project_name', 'start_date', 'end_date', 'country_id',
            'city_id', 'description', 'project_manager', 'contact_person',
            'contact_phone', 'contact_email', 'project_points',
            'num_voliunteers', 'deadline', 'conditions',
            'execution_type_id', 'available'
        ];
        
        let hasUpdates = false;
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
                hasUpdates = true;
            }
        });

        // تحديث الصورة إذا تم تحميل ملف جديد
        if (req.file) {
            // حذف الصورة القديمة إذا كانت موجودة
            if (project.photo) {
                const oldPhotoPath = path.join(__dirname, '../uploads', project.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            // حفظ الصورة الجديدة
            project.photo = req.file.filename;
            hasUpdates = true;
        }

        if (!hasUpdates) {
            response.message.push("No valid fields to update");
            return res.status(400).send(response);
        }

        await project.save();
        response.success = true;
        response.message.push("Project updated successfully");
        response.data = projectTransformer(project);
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error updating project");
        res.status(500).send(response);
    }
}

// حذف المشروع مع الصورة
exports.delete = async function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    
    // التحقق من صلاحية الأدمن
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        response.message.push("Authorization token required");
        return res.status(401).send(response);
    }
    
    try {
        const isVerified = await authService.verifyAdmin(token);
        if (!isVerified) {
            response.message.push("Unauthorized access");
            return res.status(403).send(response);
        }

        const projectId = req.params.id;
        if (isNaN(projectId)) {
            response.message.push("Invalid project ID");
            return res.status(400).send(response);
        }

        const project = await models.Projects.findByPk(projectId);
        if (!project) {
            response.message.push("Project not found");
            return res.status(404).send(response);
        }

        // حذف الصورة المرتبطة
        if (project.photo) {
            const photoPath = path.join(__dirname, '../public', project.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await project.destroy();
        response.success = true;
        response.message.push("Project deleted successfully");
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error deleting project");
        res.status(500).send(response);
    }
}
























// // ✅ بعد ربط Cloudinary - هذا هو الكود المعدل:

// const models = require('../models');
// const authService = require('../services/auth');
// const { Op } = require("sequelize");
// const { projectTransformer, projectsTransformer } = require('../transform/projectPhoto');
// const { cloudinaryUpload, cloudinaryDelete } = require('../utils/cloudinary');

// // عرض جميع المشاريع
// exports.index = async (req, res) => {
//   const response = { success: false, message: [], data: [] };
//   try {
//     const projects = await models.Projects.findAll({
//       include: [
//         models.Projects_Categories,
//         { model: models.Cities, attributes: ['id', 'name'] },
//         { model: models.Countries, attributes: ['id', 'name'] },
//         { model: models.Execution_types, attributes: ['id', 'execution_type'] },
//       ],
//     });

//     if (projects.length) {
//       response.success = true;
//       response.data = projectsTransformer(projects);
//     } else {
//       response.message.push("No projects found");
//     }
//     res.send(response);
//   } catch (err) {
//     console.error(err);
//     response.message.push("Error fetching projects");
//     res.status(500).send(response);
//   }
// };

// // إضافة مشروع
// exports.add = async (req, res) => {
//   const response = { success: false, message: [], data: {} };
//   const token = req.headers?.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ success: false, message: ["Token required"] });

//   try {
//     const isVerified = await authService.verifyAdmin(token);
//     if (!isVerified) return res.status(403).json({ success: false, message: ["Unauthorized"] });

//     const required = ['project_name', 'start_date', 'end_date', 'country_id', 'city_id', 'deadline'];
//     const missing = required.filter(f => !req.body[f]);
//     if (missing.length) return res.status(400).json({ success: false, message: [`Missing: ${missing.join(', ')}`] });

//     let photoUrl = null;
//     if (req.file) {
//       const uploaded = await cloudinaryUpload(req.file.path);
//       photoUrl = uploaded.secure_url;
//     }

//     const newProject = await models.Projects.create({
//       ...req.body,
//       photo: photoUrl
//     });

//     response.success = true;
//     response.data = newProject;
//     response.message.push("Project created successfully");
//     res.status(201).send(response);
//   } catch (err) {
//     console.error(err);
//     response.message.push("Error creating project");
//     res.status(500).send(response);
//   }
// };

// // عرض مشروع
// exports.show = async (req, res) => {
//   const response = { success: false, message: [], data: {} };
//   try {
//     const project = await models.Projects.findByPk(req.params.id, {
//       include: [
//         models.Projects_Categories,
//         { model: models.Cities, attributes: ['id', 'name'] },
//         { model: models.Countries, attributes: ['id', 'name'] },
//         { model: models.Execution_types, attributes: ['id', 'execution_type'] },
//       ],
//     });
//     if (!project) return res.status(404).json({ success: false, message: ["Not found"] });
//     response.success = true;
//     response.data = projectTransformer(project);
//     res.send(response);
//   } catch (err) {
//     console.error(err);
//     response.message.push("Error");
//     res.status(500).send(response);
//   }
// };

// // تعديل مشروع
// exports.update = async (req, res) => {
//   const response = { success: false, message: [], data: {} };
//   const token = req.headers?.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ success: false, message: ["Token required"] });

//   try {
//     const isVerified = await authService.verifyAdmin(token);
//     if (!isVerified) return res.status(403).json({ success: false, message: ["Unauthorized"] });

//     const project = await models.Projects.findByPk(req.params.id);
//     if (!project) return res.status(404).json({ success: false, message: ["Project not found"] });

//     if (req.file) {
//       if (project.photo?.includes("res.cloudinary")) {
//         const publicId = project.photo.split("/").pop().split(".")[0];
//         await cloudinaryDelete(publicId);
//       }
//       const uploaded = await cloudinaryUpload(req.file.path);
//       req.body.photo = uploaded.secure_url;
//     }

//     await project.update(req.body);
//     response.success = true;
//     response.data = projectTransformer(project);
//     response.message.push("Updated");
//     res.send(response);
//   } catch (err) {
//     console.error(err);
//     response.message.push("Error updating");
//     res.status(500).send(response);
//   }
// };

// // حذف مشروع
// exports.delete = async (req, res) => {
//   const response = { success: false, message: [] };
//   const token = req.headers?.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ success: false, message: ["Token required"] });

//   try {
//     const isVerified = await authService.verifyAdmin(token);
//     if (!isVerified) return res.status(403).json({ success: false, message: ["Unauthorized"] });

//     const project = await models.Projects.findByPk(req.params.id);
//     if (!project) return res.status(404).json({ success: false, message: ["Not found"] });

//     if (project.photo?.includes("res.cloudinary")) {
//       const publicId = project.photo.split("/").pop().split(".")[0];
//       await cloudinaryDelete(publicId);
//     }

//     await project.destroy();
//     response.success = true;
//     response.message.push("Deleted");
//     res.send(response);
//   } catch (err) {
//     console.error(err);
//     response.message.push("Error deleting");
//     res.status(500).send(response);
//   }
// };
