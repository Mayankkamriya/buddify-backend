const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBid = async (req, res) => {
  try {
    const { projectId, bidAmount, completionTime, message } = req.body;
    const sellerId = req.user.id;

    const bid = await prisma.bid.create({
      data: {
        projectId,
        sellerId,
        bidAmount,
        completionTime,
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

    const bids = await prisma.bid.findMany({
      where: { projectId: Number(projectId) },
      include: { seller: true }
    });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBid, getProjectBids };
