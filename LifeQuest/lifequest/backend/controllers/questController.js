const questService = require('../services/questService');

async function create(req, res, next) {
  try {
    const quest = await questService.createQuest(req.user.id, req.body);
    res.status(201).json({ success: true, quest });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const quests = await questService.listQuests(req.user.id, req.query.status);
    res.json({ success: true, quests });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const quest = await questService.getQuestOwned(req.user.id, req.params.id);
    res.json({ success: true, quest });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const quest = await questService.updateQuest(req.user.id, req.params.id, req.body);
    res.json({ success: true, quest });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await questService.deleteQuest(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const result = await questService.completeQuest(req.user.id, req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove, complete };
