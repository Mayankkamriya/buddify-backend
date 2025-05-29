const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
  try {
    const { title, description, budgetMin, budgetMax, deadline } = req.body;
    const buyerId = req.user.id;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budgetMin: parseFloat(budgetMin),
        budgetMax: parseFloat(budgetMax),
        deadline: new Date(deadline),
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

    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

       const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    const project = await prisma.project.update({
      where: { id: projectId }, // Corrected: treat as string
      data: { status }
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getAllProjects, updateProjectStatus };
