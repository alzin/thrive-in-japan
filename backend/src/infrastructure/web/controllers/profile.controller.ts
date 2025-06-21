import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';
import { StorageService } from '../../services/StorageService';

export class ProfileController {
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileRepository = new ProfileRepository();
      const profile = await profileRepository.findByUserId(req.user!.userId);
      
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, bio, languageLevel } = req.body;
      const profileRepository = new ProfileRepository();
      
      const profile = await profileRepository.findByUserId(req.user!.userId);
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      profile.name = name || profile.name;
      profile.bio = bio !== undefined ? bio : profile.bio;
      profile.languageLevel = languageLevel || profile.languageLevel;
      profile.updatedAt = new Date();

      const updatedProfile = await profileRepository.update(profile);
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  async uploadProfilePhoto(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const storageService = new StorageService();
      const photoUrl = await storageService.uploadProfilePhoto(
        req.user!.userId,
        req.file.buffer,
        req.file.mimetype
      );

      const profileRepository = new ProfileRepository();
      const profile = await profileRepository.findByUserId(req.user!.userId);
      
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      profile.profilePhoto = photoUrl;
      profile.updatedAt = new Date();

      const updatedProfile = await profileRepository.update(profile);
      res.json({ profilePhoto: updatedProfile.profilePhoto });
    } catch (error) {
      next(error);
    }
  }
}