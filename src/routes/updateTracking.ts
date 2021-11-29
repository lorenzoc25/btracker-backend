import express, {
  Request,
  Response,
} from 'express';
import { PackageModel } from '../schema/packageSchema';

const router = express.Router();

router.post('/', async (
  req: Request,
  res: Response,
) => {
  if (req.body === undefined) {
    res.status(400).json({
      message: 'The field \'tracking\' and \'name\' are missing in the request body',
    });
    return;
  }

  const {
    tracking,
    name,
  } = req.body;

  if (tracking === undefined) {
    res.status(400).json({
      message: 'The field \'tracking\' is missing in the request body',
    });
    return;
  }

  if (name === undefined) {
    res.status(400).json({
      message: 'The field \'name\' is missing in the request body',
    });
    return;
  }

  const filter = { tracking };
  const update = { name };

  const response = await PackageModel.findOneAndUpdate(
    filter,
    update,
  );

  res.status(200).send(response);
});

export default router;
