const prisma = require("../config/prisma");

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch departments",
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(department);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create department",
    });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
};