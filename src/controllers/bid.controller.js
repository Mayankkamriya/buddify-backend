const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBid = async (req, res) => {
  try {
    const { projectId, amount, estimatedTime, message } = req.body;
    const sellerId = req.user.id;

    // Basic field validation
    if (!projectId || !amount || !estimatedTime || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

 // Prevent seller from bidding on their own project
    if (existingProject.buyerId === sellerId) {
      return res.status(403).json({ message: "You cannot bid on your own project." });
    }

   const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { name: true }
    });

    const bid = await prisma.bid.create({
      data: {
        projectId,
        sellerId,
        sellerName: seller.name,
        amount,
        estimatedTime,
        message
      }
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    const bids = await prisma.bid.findMany({
      where: { projectId },
      include: { seller: true }
    });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBid, getProjectBids };
