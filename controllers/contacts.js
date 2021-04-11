const ContactDB = require('../model/schema/contactSchema');

const getContacts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const contacts = await ContactDB.getContacts(userId);
    res.json({
      status: 200,
      message: 'List of contacts',
      data: contacts,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const userId = req.userId;
    const contact = await ContactDB.getContactsByID(userId, contactId);
    contact
      ? res.json({
          status: 200,
          message: 'Contact by ID',
          data: contact,
        })
      : res.json({
          status: 404,
          message: 'Not found',
        });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const createContact = async (req, res, next) => {
  const { body } = req;
  const { name, email, phone } = body;

  let field;

  switch (true) {
    case !name && !email && !phone:
      field = 'all';
      break;

    case !name && !email:
      field = 'name, email';
      break;

    case !name && !phone:
      field = 'name,phone';
      break;

    case !email && !phone:
      field = 'email,phone';
      break;

    case !email:
      field = 'email';
      break;

    case !phone:
      field = 'phone';
      break;

    case !name:
      field = 'name';
      break;

    default:
      field = 'some';
  }

  if (name && email && phone) {
    try {
      const userId = req.userId;
      const newContact = await ContactDB.createContact(userId, body);
      res.json({
        status: 201,
        message: 'Contact added',
        data: newContact,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  } else {
    res.json({
      status: 400,
      message: `missing ${field} field(s)`,
    });
  }
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const userId = req.userId;
    const index = await ContactDB.deleteContact(userId, contactId);
    console.log(index);

    index !== -1
      ? res.json({
          status: 200,
          message: 'Contact deleted',
        })
      : res.json({
          status: 404,
          message: 'Not found',
        });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;

    if (body) {
      const userId = req.userId;
      const updatedContact = await ContactDB.updateContact(userId, contactId, body);

      if (updatedContact) {
        res.json({
          status: 200,
          message: 'Contact is updated',
          data: updatedContact,
        });
      } else {
        res.json({
          status: 404,
          message: 'Not found',
        });
      }
    } else {
      res.json({
        status: 400,
        message: 'missing fields',
      });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};