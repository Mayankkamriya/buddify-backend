const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
  try {
    const { title, description, budgetRange, deadline } = req.body;
    const buyerId = req.user.id;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budgetRange,
        deadline,
        status: 'PENDING',
        buyerId
      }
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'PENDING' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await prisma.project.update({
      where: { id: Number(projectId) },
      data: { status }
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getAllProjects, updateProjectStatus };
