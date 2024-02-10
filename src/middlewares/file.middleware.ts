import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors";
import {avatarConfigs} from "../configs";

class FileMiddleware{
    public  async isAvatarValid(req: Request, res: Response, next: NextFunction){
        try{
            if (Array.isArray(req.files.avatar)){
                throw new ApiError("Avatar is not an array", 400)
            }
            const{size,mimetype} = req.files.avatar;

            if(size > avatarConfigs.MAX_SIZE)
            {
                throw  new ApiError("Avatar is too big", 400)
            }

            if(!avatarConfigs.MIMETYPES.includes(mimetype)){
                throw new ApiError("Avatar has invalid type", 400)
            }
            next()
        }catch(e){
        next(e);
        }

    }
}

export const fileMiddleware = new FileMiddleware()
