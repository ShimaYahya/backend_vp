var models = require('../models');
var authService = require('../services/auth');
const { Op } = require("sequelize");

// إضافة فئة إلى مشروع
exports.addCategoryToProject = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    };

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

        // التحقق من وجود المعرفات
        if (!req.body.project_id || !req.body.category_id) {
            response.message.push("Both project_id and category_id are required");
            return res.status(400).send(response);
        }

        // التحقق من وجود المشروع والفئة
        const project = await models.Projects.findByPk(req.body.project_id);
        const category = await models.Categories.findByPk(req.body.category_id);

        if (!project) {
            response.message.push("Project not found");
            return res.status(404).send(response);
        }

        if (!category) {
            response.message.push("Category not found");
            return res.status(404).send(response);
        }

        // إنشاء العلاقة
        const link = await models.Projects_Categories.create({
            project_id: req.body.project_id,
            category_id: req.body.category_id
        });

        response.success = true;
        response.message.push("Category added to project successfully");
        response.data = link;
        res.status(201).send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error adding category to project");
        res.status(500).send(response);
    }
};

// إزالة فئة من مشروع
exports.removeCategoryFromProject = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    };

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

        // التحقق من وجود المعرفات
        if (!req.body.project_id || !req.body.category_id) {
            response.message.push("Both project_id and category_id are required");
            return res.status(400).send(response);
        }

        // إزالة العلاقة
        const result = await models.Projects_Categories.destroy({
            where: {
                project_id: req.body.project_id,
                category_id: req.body.category_id
            }
        });

        if (result === 0) {
            response.message.push("Relationship not found");
            return res.status(404).send(response);
        }

        response.success = true;
        response.message.push("Category removed from project successfully");
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error removing category from project");
        res.status(500).send(response);
    }
};

// الحصول على فئات مشروع معين
exports.getProjectCategories = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: []
    };

    const projectId = req.params.projectId;
    if (isNaN(projectId)) {
        response.message.push("Invalid project ID");
        return res.status(400).send(response);
    }

    try {
        const categories = await models.Projects_Categories.findAll({
            where: { project_id: projectId },
            include: [{
                model: models.Categories,
                attributes: ['id', 'category_name'] // الحقول التي تريدها من جدول الفئات
            }, {
                model: models.Projects,
                attributes: ['id', 'project_name'] // الحقول التي تريدها من جدول المشاريع
            }]
        });

        if (categories.length > 0) {
            response.success = true;
            response.data = categories;
        } else {
            response.message.push("No categories found for this project");
        }
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error fetching project categories");
        res.status(500).send(response);
    }
};

// الحصول على مشاريع لفئة معينة
exports.getCategoryProjects = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: []
    };

    const categoryId = req.params.categoryId;
    if (isNaN(categoryId)) {
        response.message.push("Invalid category ID");
        return res.status(400).send(response);
    }

    try {
        const projects = await models.Projects_Categories.findAll({
            where: { category_id: categoryId },
            include: [{
                model: models.Projects,
                attributes: ['id', 'project_name'] // الحقول التي تريدها من جدول المشاريع
            }, {
                model: models.Categories,
                attributes: ['id', 'category_name'] // الحقول التي تريدها من جدول المشاريع
            }]
        });

        if (projects.length > 0) {
            response.success = true;
            response.data = projects;
        } else {
            response.message.push("No projects found for this category");
        }
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error fetching category projects");
        res.status(500).send(response);
    }
};

// تحديث فئات المشروع (استبدال الكل)
exports.updateProjectCategories = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    };

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

        const projectId = req.params.projectId;
        if (isNaN(projectId)) {
            response.message.push("Invalid project ID");
            return res.status(400).send(response);
        }

        if (!Array.isArray(req.body.category_ids)) {
            response.message.push("category_ids must be an array");
            return res.status(400).send(response);
        }

        // التحقق من وجود المشروع
        const project = await models.Projects.findByPk(projectId);
        if (!project) {
            response.message.push("Project not found");
            return res.status(404).send(response);
        }

        // حذف جميع العلاقات الحالية للمشروع
        await models.Projects_Categories.destroy({
            where: { project_id: projectId }
        });

        // إضافة العلاقات الجديدة
        const links = [];
        for (const categoryId of req.body.category_ids) {
            // التحقق من وجود الفئة
            const category = await models.Categories.findByPk(categoryId);
            if (category) {
                const link = await models.Projects_Categories.create({
                    project_id: projectId,
                    category_id: categoryId
                });
                links.push(link);
            }
        }

        response.success = true;
        response.message.push("Project categories updated successfully");
        response.data = links;
        res.send(response);
    } catch (error) {
        console.error(error);
        response.message.push("Error updating project categories");
        res.status(500).send(response);
    }
};