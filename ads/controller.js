import Ads from '../models/Ads'; 


export const createAd = async (req, res) => {
  const { image, content, publisher, redirectionLink } = req.body;
  
  try {
    const newAd = new Ads({ image, content, publisher, redirectionLink });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAds = async (req, res) => {
  try {
    const ads = await Ads.find().populate('publisher', 'name'); 
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAdById = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ads.findById(id).populate('publisher', 'name'); 
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateAd = async (req, res) => {
  const { id } = req.params;
  const { image, content, publisher, redirectionLink } = req.body;

  try {
    const updatedAd = await Ads.findByIdAndUpdate(id, { image, content, publisher, redirectionLink }, { new: true });
    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAd = await Ads.findByIdAndDelete(id);
    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
