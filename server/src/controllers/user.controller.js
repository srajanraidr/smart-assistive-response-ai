const prisma = require("../config/prisma");

const getDispatchers = async (req, res) => {
  try {
    const dispatchers = await prisma.user.findMany({
      where: {
        role: "DISPATCHER",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    res.json(dispatchers);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch dispatchers",
    });
  }
};

module.exports = {
  getDispatchers,
};