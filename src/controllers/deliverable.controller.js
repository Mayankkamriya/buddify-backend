const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadDeliverable = async (req, res) => {
  try {
    const { projectId, fileUrl } = req.body;
    const sellerId = req.user.id;

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        fileUrl,
        sellerId
      }
    });

    await prisma.project.update({
      where: { id: Number(projectId) },
      data: { status: 'COMPLETED' }
    });

    res.status(201).json({ message: 'Deliverable uploaded and project completed', deliverable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadDeliverable };
