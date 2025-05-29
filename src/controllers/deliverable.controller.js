const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadDeliverable = async (req, res) => {
  try {
    const { projectId, fileUrl } = req.body;

    // Validate input fields
    if (!projectId || !fileUrl) {
      return res.status(400).json({ message: "projectId and fileUrl are required." });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Create deliverable record
    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        fileUrl
      }
    });

    // Update project status to COMPLETED
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'COMPLETED' }
    });

    res.status(201).json({ message: 'Deliverable uploaded and project completed', deliverable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadDeliverable };
