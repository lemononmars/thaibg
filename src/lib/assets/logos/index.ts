import Supporter1 from './bgdt logo.jpg'
import Supporter2 from './lunar gravity logo.png'
import Supporter3 from './wizards-of-learning.jpg'
import Supporter4 from './TBGA-logo.png'

interface Links {
   website?: string;
   facebook?: string;
   twitter?: string;
   email?: string;
}

export default [
   {
      image: Supporter3, 
      links: [
         "facebook.com/WizardsofLearning",
         "twitter.com/WizardsLearning",
      ],
   },
   {
      image: Supporter2, 
      links: [
         "facebook.com/LunarGravityGames"
      ],
   },
   {
      image: Supporter1, 
      links: [
         "facebook.com/BoardGameDesignerThailand/"
      ],
   }, 
   {
      image: Supporter4, 
      links: [
         "facebook.com/thailandboardgameassociation/"
      ],
   }, 
]