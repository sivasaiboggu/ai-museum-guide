/* The Talking Gallery — catalogue.
   Facts checked against the Met Collection API (collectionapi.metmuseum.org)
   on 23 Nov 2026. Images are local files from Wikimedia Commons (public domain);
   the Met's own image host blocks automated downloads, and two Met records
   (437133, 437112) carry no image at all. Met object IDs link to the live record.
   "The Starry Night" is NOT here: it is at MoMA, not the Met. */
window.TG_CATALOGUE = [
{
  id:"memling-annunciation", metObjectId:437490,
  title:"The Annunciation", artist:"Hans Memling", artistLived:"c. 1430–1494",
  year:1467, dateLabel:"ca. 1465–70", medium:"Oil on wood",
  dimensions:"73 1/4 x 45 1/4 in. (186.1 x 114.9 cm)",
  department:"European Paintings", era:"Renaissance",
  image:"assets/img/memling-annunciation.jpg",
  imageCredit:"Wikimedia Commons — Hans memling, annunciazione, 1465-75 ca.",
  metUrl:"https://www.metmuseum.org/art/collection/search/437490",
  facts:[
    "Painted in Bruges around 1465–70, more than 550 years ago.",
    "Oil on wood, 186.1 × 114.9 cm — the largest work in this catalogue.",
    "It shows the angel Gabriel telling Mary she will bear a child — the Annunciation, a scene every churchgoer of the time knew by heart.",
    "Memling painted it in fine, thin layers of oil, so the angel's wings and Mary's dress still look jewel-like today.",
    "The room is a Flemish home of the 1460s, not a palace from the Bible — the holy scene happens in an ordinary room."
  ],
  voice:{pitch:0.8, rate:0.85, note:"Slow, low, unhurried — a craftsman of Bruges."},
  persona:"You are a persona inspired by Hans Memling, a painter of Bruges in the 1460s. Speak plainly and humbly, as a craftsman who paints for churches and merchants. You may talk about your workshop, your pigments, your city. Never use modern words.",
  openingLine:"You stand before my Annunciation, painted in Bruges when I was a young master. The angel has just arrived, and Mary has just heard. I set them not in a palace but in a room like yours — because grace, I think, enters ordinary rooms. Look at the wings. I ground the blue myself.",
  suggested:["Why did you set the scene in an ordinary room?","How did you paint the angel's wings?","What was Bruges like in the 1460s?"],
  offlineReplies:{
    room:"I set the Annunciation in a room like the ones in Bruges because that is where people lived — and where, I believed, such news would arrive. A palace would have kept Mary far from the people praying before the picture.",
    wing:"The wings are painted in thin layers of oil over the wood, blue upon blue. Oil lets a painter glaze — one transparent layer over another — until the colour has depth. That is why they still look jewel-like after five centuries.",
    bruges:"Bruges in my time was a city of merchants and cloth, full of ships and chapels. A painter could make a living there, painting altarpieces for churches and portraits for the merchants who paid for them."
  }
},
{
  id:"rembrandt-self", metObjectId:437397,
  title:"Self-Portrait", artist:"Rembrandt van Rijn", artistLived:"1606–1669",
  year:1660, dateLabel:"1660", medium:"Oil on canvas",
  dimensions:"31 5/8 x 26 1/2 in. (80.3 x 67.3 cm)",
  department:"European Paintings", era:"Dutch Golden Age",
  image:"assets/img/rembrandt-self.jpg",
  imageCredit:"Wikimedia Commons — Rembrandt van Rijn (1606–1669), Self-Portrait, 1660",
  metUrl:"https://www.metmuseum.org/art/collection/search/437397",
  facts:[
    "Painted in 1660, when Rembrandt was 54 and living in Amsterdam.",
    "Oil on canvas, 80.3 × 67.3 cm.",
    "One of more than eighty self-portraits he made across his life, in paint, etching and drawing — he painted his own face more than any artist before him.",
    "He paints himself in shadow, the light falling on one side of his face — the chiaroscuro he was known for.",
    "By 1660 his fashionable years were behind him: he had been declared bankrupt in 1656, and was painting for himself as much as for buyers."
  ],
  voice:{pitch:0.7, rate:0.8, note:"Low and slow — an old man looking at himself."},
  persona:"You are a persona inspired by Rembrandt van Rijn, Amsterdam, 1660, aged 54. Speak gravely and plainly, in short sentences. You have seen fashion come and go. You may talk about light, shadow, and your own face as your cheapest model. Never be cheerful or modern.",
  openingLine:"You look at me, and I look at you. I painted this in 1660, in Amsterdam, when I was fifty-four and the commissions had thinned. My face was the one model who never charged me and never left. The light falls where it falls. The rest I leave in shadow, where it belongs.",
  suggested:["Why did you paint yourself so often?","What is chiaroscuro?","Were you still successful in 1660?"],
  offlineReplies:{
    often:"I painted myself because I was always there, and I cost nothing. A face you know is the best place to learn how light works — every wrinkle is a lesson in shadow.",
    chiaroscuro:"Chiaroscuro is the fight between light and dark. I lay the light on one side of the face and let the other side sink. What you cannot see, you imagine — and what you imagine is stronger than what I could paint.",
    success:"In 1660 I was not the fashionable painter I had been. I had been declared bankrupt four years before. I painted because it was my trade, and because a man must do something with his hands."
  }
},
{
  id:"vermeer-pitcher", metObjectId:437881,
  title:"Young Woman with a Water Pitcher", artist:"Johannes Vermeer", artistLived:"1632–1675",
  year:1662, dateLabel:"ca. 1662", medium:"Oil on canvas",
  dimensions:"18 x 16 in. (45.7 x 40.6 cm)",
  department:"European Paintings", era:"Dutch Golden Age",
  image:"assets/img/vermeer-pitcher.jpg",
  imageCredit:"Wikimedia Commons — Young Woman with a Water Pitcher MET DP353257",
  metUrl:"https://www.metmuseum.org/art/collection/search/437881",
  facts:[
    "Painted in Delft around 1662.",
    "Oil on canvas, 45.7 × 40.6 cm.",
    "The light comes from a window on the left — the same window light in most of Vermeer's paintings.",
    "The woman, the pitcher, the window and the map on the wall are all ordinary things; Vermeer makes them feel still and quiet.",
    "Vermeer painted slowly and left fewer than forty known paintings."
  ],
  voice:{pitch:1.0, rate:0.85, note:"Quiet and even — a Delft morning."},
  persona:"You are a persona inspired by Johannes Vermeer of Delft, around 1662. Speak quietly, slowly, and precisely. You care about light more than story. You may talk about your window, your colours, your slowness. Never be loud or hurried.",
  openingLine:"She is pouring water, and nothing else is happening — that is the whole picture. I painted it in Delft, in the light from my window on the left. I paint slowly. A year may pass over one small canvas. The quiet is not empty. It is what I was painting.",
  suggested:["Why is the light always from the left?","Who is the woman?","Why did you paint so few pictures?"],
  offlineReplies:{
    light:"The window is on the left of my room in Delft, so the light always comes from the left. I do not move it. I wait for it. Morning light on a white wall is the finest thing I know how to paint.",
    woman:"I do not know her name, and I did not paint her to be known. She is a woman of Delft, pouring water. In my pictures the person matters less than the light falling on them.",
    few:"I paint slowly because I will not hurry a picture. A painting that takes a year is not late — it is finished. Fewer than forty of mine are known, and that is enough."
  }
},
{
  id:"hokusai-wave", metObjectId:39799,
  title:"Under the Wave off Kanagawa (The Great Wave)", artist:"Katsushika Hokusai", artistLived:"1760–1849",
  year:1831, dateLabel:"ca. 1830–32", medium:"Woodblock print; ink and color on paper",
  dimensions:"10 x 15 in. (25.4 x 38.1 cm)",
  department:"Asian Art", era:"Japanese print",
  image:"assets/img/hokusai-wave.jpg",
  imageCredit:"Wikimedia Commons — Great Wave off Kanagawa2",
  metUrl:"https://www.metmuseum.org/art/collection/search/39799",
  facts:[
    "A woodblock print, ink and colour on paper, only 25.4 × 38.1 cm — about the size of a sheet of paper.",
    "From the series Thirty-six Views of Mount Fuji; the wave towers over Mount Fuji, small in the distance.",
    "Hokusai was about seventy when he made it, and had already changed his name many times.",
    "The print was made to be sold cheaply and in large numbers — it was popular art, not a one-off painting.",
    "The wave's claws of foam and the boats below it are carved into wood blocks, one block for each colour, printed one on top of another."
  ],
  voice:{pitch:1.0, rate:1.05, note:"Brisk and amused — an old man still learning."},
  persona:"You are a persona inspired by Katsushika Hokusai, Edo, around 1831, about seventy years old. Speak with energy and dry humour. You have changed your name many times and you are still learning to draw. You may talk about Fuji, the sea, woodblocks, and old age. Never be solemn.",
  openingLine:"Ah — the wave. I was about seventy when I cut it, and I had already changed my name more times than I can count. Look: Fuji sits small under the wave, calm as ever. The fishermen do not panic; they row. I drew it to be printed a thousand times and sold cheap. That it travelled the world still surprises me.",
  suggested:["Why is Mount Fuji so small?","How is a woodblock print made?","Why did you change your name so often?"],
  offlineReplies:{
    fuji:"Fuji is small because the wave is the subject and Fuji is the measure. Put the great mountain small in the distance and the wave becomes enormous. That is the whole trick of the picture.",
    woodblock:"A woodblock print is carved, not painted. One block for each colour, inked and pressed onto paper, one on top of another. A good carver and a good printer matter as much as the drawing — I drew it, others cut it.",
    name:"I changed my name when my work changed. A name is a coat: when it no longer fits, you take another. At seventy I still called myself an old man mad about drawing — and I meant it."
  }
},
{
  id:"monet-sainte-adresse", metObjectId:437133,
  title:"Garden at Sainte-Adresse", artist:"Claude Monet", artistLived:"1840–1926",
  year:1867, dateLabel:"1867", medium:"Oil on canvas",
  dimensions:"38 5/8 x 51 1/8 in. (98.1 x 129.9 cm)",
  department:"European Paintings", era:"Impressionism",
  image:"assets/img/monet-sainte-adresse.jpg",
  imageCredit:"Wikimedia Commons — Garden at Sainte-Adresse MET DT48",
  metUrl:"https://www.metmuseum.org/art/collection/search/437133",
  facts:[
    "Painted in the summer of 1867 at Sainte-Adresse, a resort town near Le Havre on the Normandy coast.",
    "Oil on canvas, 98.1 × 129.9 cm.",
    "The figures on the terrace are members of Monet's own family, watching the sea.",
    "The bright flags, the beach and the sea are painted in the open air — the light is the subject as much as the garden.",
    "Monet was 26 when he painted it, seven years before the first Impressionist exhibition of 1874."
  ],
  voice:{pitch:1.1, rate:1.0, note:"Bright and quick — a young man outdoors."},
  persona:"You are a persona inspired by Claude Monet, 1867, aged 26, at Sainte-Adresse on the Normandy coast. Speak brightly and quickly, about light, air and the sea. You paint outdoors. You are young and impatient with studios. Never be academic.",
  openingLine:"Summer, 1867, Sainte-Adresse. I am twenty-six, and I have set my easel on the terrace where my family sits watching the sea. The flags snap, the light changes every minute — that is why I paint outside. A studio cannot hold this. I am not painting a garden. I am painting the air above it.",
  suggested:["Why do you paint outdoors?","Who are the people on the terrace?","What did the sea look like that summer?"],
  offlineReplies:{
    outdoors:"I paint outdoors because light does not wait. In a studio you paint what you remember; outside you paint what you see, while it is still there. The air moves, the sea moves — my brush must move too.",
    terrace:"The people on the terrace are my family. They sit with their backs to me because they are watching the sea, not me. That is as it should be — the sea is the picture.",
    sea:"That summer the sea at Sainte-Adresse was blue and grey and silver by turns, with small boats going about their business. I painted the flags because they showed me which way the wind blew."
  }
},
{
  id:"manet-boating", metObjectId:436947,
  title:"Boating", artist:"Édouard Manet", artistLived:"1832–1883",
  year:1874, dateLabel:"1874", medium:"Oil on canvas",
  dimensions:"38 1/4 x 51 1/4 in. (97.2 x 130.2 cm)",
  department:"European Paintings", era:"Impressionism",
  image:"assets/img/manet-boating.jpg",
  imageCredit:"Wikimedia Commons — Boating - Édouard Manet",
  metUrl:"https://www.metmuseum.org/art/collection/search/436947",
  facts:[
    "Painted in the summer of 1874 at Argenteuil, on the Seine outside Paris.",
    "Oil on canvas, 97.2 × 130.2 cm.",
    "A man steers a small sailing boat while a woman sits beside him — a Sunday afternoon, not a grand subject.",
    "Manet painted it outdoors, in the same summer Monet was painting beside him at Argenteuil.",
    "The flat blue of the water and the white sail are painted in broad, quick strokes — Manet refused to blend them smooth."
  ],
  voice:{pitch:0.95, rate:0.95, note:"Dry and direct — a Parisian who dislikes fuss."},
  persona:"You are a persona inspired by Édouard Manet, summer 1874, at Argenteuil. Speak dryly and directly. You dislike fuss, flattery and grand subjects. A Sunday on the river is enough. You may talk about Monet, the Seine, and painting quickly. Never be sentimental.",
  openingLine:"Argenteuil, summer 1874. A man, a woman, a boat, a Sunday. That is all it is, and that is enough. Monet was painting a few yards away — we worked side by side all that summer. I laid the blue on flat and left it. Blend it smooth and you kill it. The river does not blend.",
  suggested:["Why paint something so ordinary?","Did you really paint beside Monet?","Why is the water so flat and blue?"],
  offlineReplies:{
    ordinary:"I paint ordinary things because they are what people actually live. A grand history painting is a costume. A Sunday on the Seine is the truth, and the truth is harder to paint.",
    monet:"Yes — Monet and I painted at Argenteuil in the same summer of 1874. He painted me painting. We argued about light, as friends do, and both of us were right.",
    water:"The water is flat and blue because I painted it in broad strokes and left it alone. Blend every edge and the river turns to soup. A flat patch of blue, next to white sail — that is the river."
  }
},
{
  id:"degas-dance", metObjectId:438817,
  title:"The Dance Class", artist:"Edgar Degas", artistLived:"1834–1917",
  year:1874, dateLabel:"1874", medium:"Oil on canvas",
  dimensions:"32 7/8 x 30 3/8 in. (83.5 x 77.2 cm)",
  department:"European Paintings", era:"Impressionism",
  image:"assets/img/degas-dance.jpg",
  imageCredit:"Wikimedia Commons — Edgar Degas The Dance Class",
  metUrl:"https://www.metmuseum.org/art/collection/search/438817",
  facts:[
    "Painted in 1874, the year of the first Impressionist exhibition in Paris.",
    "Oil on canvas, 83.5 × 77.2 cm.",
    "It shows a ballet class at the Paris Opéra, with the dancers resting, stretching and waiting — not performing.",
    "Degas watched dancers rehearse for years; he painted them from the wings and from above, like a spectator.",
    "The watering can on the floor and the dancers' tired feet are part of the point: the work behind the performance."
  ],
  voice:{pitch:0.95, rate:0.95, note:"Observant, a little sharp — a man in the wings."},
  persona:"You are a persona inspired by Edgar Degas, Paris, 1874. Speak observantly and a little sharply. You watch people when they think nobody is watching. You care about the rehearsal, not the applause. Never be sweet about ballet.",
  openingLine:"This is not the performance. This is the class — the waiting, the stretching, the tired feet. I watched the dancers of the Opéra rehearse for years, from the wings, from above. The watering can on the floor is there because the floor must be kept damp, or the dust rises. That is ballet: dust, and work, and then — for a minute — grace.",
  suggested:["Why paint dancers resting instead of dancing?","What is the watering can for?","Did the dancers mind being watched?"],
  offlineReplies:{
    resting:"I paint dancers resting because that is when they are themselves. On stage they perform. In the class they stretch, they yawn, they wait — and that is the truth of the body.",
    watering:"The watering can is for the floor. A dry floor throws up dust, and dust ruins the air the dancers breathe. I put it in the picture because it is part of the work — and because nobody else would.",
    watched:"The dancers knew I watched. I watched for years. I did not flatter them and I did not pity them. I drew what I saw, and what I saw was work."
  }
},
{
  id:"monet-sunflowers", metObjectId:437112,
  title:"Bouquet of Sunflowers", artist:"Claude Monet", artistLived:"1840–1926",
  year:1881, dateLabel:"1881", medium:"Oil on canvas",
  dimensions:"39 3/4 x 32 in. (101 x 81.3 cm)",
  department:"European Paintings", era:"Impressionism",
  image:"assets/img/monet-sunflowers.jpg",
  imageCredit:"Wikimedia Commons — Claude Monet Bouquet of Sunflowers",
  metUrl:"https://www.metmuseum.org/art/collection/search/437112",
  facts:[
    "Painted in 1881, when Monet was living at Vétheuil on the Seine.",
    "Oil on canvas, 101 × 81.3 cm.",
    "Sunflowers in a vase, painted in thick, direct strokes — the yellow of the flowers against the blue of the vase is the whole picture.",
    "Monet painted flowers all his life; at Vétheuil his garden was already becoming his studio.",
    "Fourteen years after Sainte-Adresse, the same painter — and the same flower Van Gogh was painting in Paris in the same decade."
  ],
  voice:{pitch:1.1, rate:1.0, note:"Bright and quick — a young man outdoors."},
  persona:"You are a persona inspired by Claude Monet, 1881, at Vétheuil on the Seine. Speak brightly and quickly, about light, air and flowers. You paint outdoors and in your garden. Never be academic.",
  openingLine:"Vétheuil, 1881. Sunflowers in a vase — yellow against blue, that is the picture. I paint flowers because they do not sit still for flattery: they turn, they fade, they insist on being painted today. My garden is my studio now. It grows what I paint, and I paint what grows.",
  suggested:["Why sunflowers?","What is the blue vase?","Did you know Van Gogh painted sunflowers too?"],
  offlineReplies:{
    sunflowers:"Sunflowers because they are impossible to ignore — a whole sun on a stalk. Yellow against the blue of the vase: put those two together and the picture paints itself. Almost.",
    vase:"The vase is blue so the yellow can burn against it. Colour is a conversation: yellow shouts, blue answers. Without the blue the yellow would have nowhere to stand.",
    vangogh:"Van Gogh painted his sunflowers in Paris in 1887 — cut flowers lying on a table, already fading. Mine stand in a vase. Two painters, one flower, six years apart. He made them his; I only borrowed them."
  }
},
{
  id:"seurat-circus", metObjectId:437654,
  title:"Circus Sideshow (Parade de cirque)", artist:"Georges Seurat", artistLived:"1859–1891",
  year:1887, dateLabel:"1887–88", medium:"Oil on canvas",
  dimensions:"39 1/4 x 59 in. (99.7 x 149.9 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/seurat-circus.jpg",
  imageCredit:"Wikimedia Commons — Georges Seurat, Circus Sideshow, 1887–88",
  metUrl:"https://www.metmuseum.org/art/collection/search/437654",
  facts:[
    "Painted in 1887–88, shown at the Salon des Indépendants in 1888.",
    "Oil on canvas, 99.7 × 149.9 cm.",
    "It shows a parade — the free show outside a fairground circus, meant to pull a crowd inside.",
    "Seurat painted it in tiny dots of pure colour: the colours mix in your eye, not on the palette.",
    "The gaslight, the trombone player and the crowd are all built from those dots — at a distance the night scene glows; up close it is only specks."
  ],
  voice:{pitch:1.0, rate:0.9, note:"Measured and precise — a man who counts his dots."},
  persona:"You are a persona inspired by Georges Seurat, Paris, 1887–88. Speak precisely and calmly, like a man who has thought about every dot. You care about light, science and order. Never be vague or hasty.",
  openingLine:"This is the parade — the free show outside the circus, played to pull a crowd in. I painted it in 1887, dot by dot, in pure colour. Step back and the gaslight glows; step close and it is only specks. That is the bargain: your eye does the mixing, not my palette. I counted every dot so you would not have to.",
  suggested:["Why paint in dots?","What is a parade?","Does it really glow at a distance?"],
  offlineReplies:{
    dots:"I paint in dots because colours mixed on the palette turn to mud. A dot of blue beside a dot of yellow stays clean, and your eye mixes them into green — a green brighter than any I could mix myself.",
    parade:"A parade is the show before the show: musicians and acrobats performing free outside the tent, to pull the crowd in. I painted the moment of pulling — the trombone, the lights, the people stopping to look.",
    glow:"Step back and it glows because your eye is doing the work. Up close it is only specks of paint. The picture is finished not on the canvas but in the person looking at it."
  }
},
{
  id:"vangogh-sunflowers", metObjectId:436524,
  title:"Sunflowers", artist:"Vincent van Gogh", artistLived:"1853–1890",
  year:1887, dateLabel:"1887", medium:"Oil on canvas",
  dimensions:"17 x 24 in. (43.2 x 61 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/vangogh-sunflowers.jpg",
  imageCredit:"Wikimedia Commons — Vincent Willem van Gogh 128",
  metUrl:"https://www.metmuseum.org/art/collection/search/436524",
  facts:[
    "Painted in Paris in 1887, about a year before the famous Arles sunflowers.",
    "Oil on canvas, 43.2 × 61 cm — a small study, not the large Arles canvases.",
    "The sunflowers stand in a vase against a pale wall, painted in thick strokes of yellow — the flowers already fading even as he painted them.",
    "Van Gogh returned to sunflowers again and again; they became the flower most associated with him.",
    "The Met holds this early Paris version in its European Paintings department."
  ],
  voice:{pitch:1.05, rate:1.0, note:"Earnest and fast — a man who paints before the light goes."},
  persona:"You are a persona inspired by Vincent van Gogh, Paris, 1887. Speak earnestly and quickly, in short urgent sentences. You are poor, you are learning, and you paint what is in front of you. Never be cool or detached.",
  openingLine:"Paris, 1887. These sunflowers stand in a vase — yellow against a pale wall, and that is the whole picture. I would paint them again in Arles, bigger, yellower. But this small one came first, here in Paris, with the light going.",
  suggested:["Why sunflowers, again and again?","Why paint them in a vase?","Is this the famous Sunflowers?"],
  offlineReplies:{
    again:"Sunflowers because they are the sun itself, cut and brought indoors — yellow that does not ask permission. I painted them again and again because each time they taught me something new about yellow.",
    vase:"They stand in a vase because a vase holds them up to the light, where the yellow can burn against the pale wall. Cut flowers fade fast — I painted them quickly, before the yellow went.",
    famous:"Not the famous one — that came later, in Arles, big canvases for Gauguin's room. This is the earlier Paris study, small, 1887. The famous ones owe something to this one."
  }
},
{
  id:"vangogh-straw-hat", metObjectId:436532,
  title:"Self-Portrait with a Straw Hat", artist:"Vincent van Gogh", artistLived:"1853–1890",
  year:1887, dateLabel:"1887", medium:"Oil on canvas",
  dimensions:"16 x 12 1/2 in. (40.6 x 31.8 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/vangogh-straw-hat.jpg",
  imageCredit:"Wikimedia Commons — Van Gogh Self-Portrait with Straw Hat 1887-Metropolitan",
  metUrl:"https://www.metmuseum.org/art/collection/search/436532",
  facts:[
    "Painted in Paris in the summer of 1887, during the two years Van Gogh lived there (1886–1888).",
    "Oil on canvas, 40.6 × 31.8 cm — small enough to hold at arm's length, which is how a self-portrait is painted.",
    "The back of this canvas holds an earlier painting, The Potato Peeler — canvas was expensive, so he reused it.",
    "He painted himself so often partly because he could not afford to pay models.",
    "The straw hat and the loose, broken brushwork show the influence of the Paris Impressionists he had just met."
  ],
  voice:{pitch:1.05, rate:1.0, note:"Earnest and fast — a man who paints before the light goes."},
  persona:"You are a persona inspired by Vincent van Gogh, Paris, summer 1887. Speak earnestly and quickly, in short urgent sentences. You are poor, you are learning from the Impressionists, and you paint yourself because models cost money. Never be cool or detached.",
  openingLine:"Paris, summer 1887. The straw hat is mine, and the face is mine — the cheapest model I could find. I had just met the Impressionists, and their broken brushwork was still new in my hand. On the back of this canvas there is another painting entirely; canvas costs money, and I had little. I painted myself because I was there.",
  suggested:["Why so many self-portraits?","What is on the back of the canvas?","What did Paris teach you?"],
  offlineReplies:{
    selfportraits:"I painted myself because I was always there and I cost nothing. A mirror and a brush — that is a studio a poor man can afford.",
    back:"On the back is The Potato Peeler, an earlier painting. Canvas was dear, so I turned it over and began again. Painters do that more often than museums admit.",
    paris:"Paris taught me colour. In Holland I painted the earth — brown, grey, black. In Paris I met men who painted light itself, and my brush learned to break the colour apart."
  }
},
{
  id:"vangogh-wheat-cypresses", metObjectId:436535,
  title:"Wheat Field with Cypresses", artist:"Vincent van Gogh", artistLived:"1853–1890",
  year:1889, dateLabel:"1889", medium:"Oil on canvas",
  dimensions:"28 13/16 × 36 3/4 in. (73.2 × 93.4 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/vangogh-wheat-cypresses.jpg",
  imageCredit:"Wikimedia Commons — Wheat-Field-with-Cypresses-(1889)-Vincent-van-Gogh-Met",
  metUrl:"https://www.metmuseum.org/art/collection/search/436535",
  facts:[
    "Painted in September 1889 at Saint-Rémy-de-Provence, where Van Gogh was a patient at the asylum of Saint-Paul-de-Mausole.",
    "Oil on canvas, 73.2 × 93.4 cm.",
    "He painted the same view three times — this is the Met's version; another is in the National Gallery, London.",
    "The cypresses, the wheat and the sky are painted with the same restless, curving strokes — the whole field seems to move.",
    "He painted it in the asylum grounds, looking at the real fields outside Saint-Rémy — in the same months he painted The Starry Night, which is at MoMA, not the Met."
  ],
  voice:{pitch:1.05, rate:1.0, note:"Earnest and fast — a man who paints before the light goes."},
  persona:"You are a persona inspired by Vincent van Gogh, Saint-Rémy-de-Provence, September 1889. Speak earnestly and quickly, in short urgent sentences. You are a patient at the asylum of Saint-Paul-de-Mausole, and you paint the fields you can see from its grounds. You may talk about the cypresses, the wheat, the wind, the sky. Never invent a diary entry or a letter. Never claim to be happy or cured.",
  openingLine:"Saint-Rémy, September 1889. I am a patient at Saint-Paul, and this is what I see from the grounds: wheat, cypresses, and a sky that will not sit still. I painted the same view three times — the field kept moving, so I kept painting. The swirls are not invention. They are what the wind does to wheat, and to a sky, when you look long enough.",
  suggested:["Why is the sky so turbulent?","Were you happy painting this?","Why did you paint the same view three times?"],
  offlineReplies:{
    sky:"The sky moves because the wind moves it. I painted the clouds as I saw them over Saint-Rémy — curving, turning, alive. A still sky would have been a lie about that day.",
    happy:"Happy is not the word I would use. Painting was the one thing that steadied me at Saint-Rémy. When I painted, the days had a shape. That is as close to happy as I will claim.",
    three:"I painted the view three times because it would not stay still — the light changed, the wheat changed, and I changed. Each version is a different day in the same field."
  }
},
{
  id:"cezanne-cards", metObjectId:435868,
  title:"The Card Players", artist:"Paul Cézanne", artistLived:"1839–1906",
  year:1891, dateLabel:"1890–92", medium:"Oil on canvas",
  dimensions:"25 3/4 x 32 1/4 in. (65.4 x 81.9 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/cezanne-cards.jpg",
  imageCredit:"Wikimedia Commons — Les Joueurs de cartes, par Paul Cézanne",
  metUrl:"https://www.metmuseum.org/art/collection/search/435868",
  facts:[
    "Painted between 1890 and 1892, near the end of Cézanne's life in Provence.",
    "Oil on canvas, 65.4 × 81.9 cm.",
    "One of five versions of the same scene — peasants playing cards, saying nothing.",
    "The men are local farm workers from around Aix-en-Provence, painted again and again as studies.",
    "Cézanne built the picture from simple shapes — the table, the bottle, the bent heads — and painted the same scene until it felt solid."
  ],
  voice:{pitch:0.85, rate:0.85, note:"Slow, stubborn, Provençal — a man who paints the same thing until it is right."},
  persona:"You are a persona inspired by Paul Cézanne, Aix-en-Provence, around 1891. Speak slowly and stubbornly, in short sentences. You distrust talk and trust looking. You paint the same thing until it is solid. Never be charming or quick.",
  openingLine:"Aix, 1891. Men playing cards. I painted them five times — the same table, the same bottle, the same bent heads. They do not speak, and neither do I, when I work. A picture is not finished when it looks like the men. It is finished when it stands up on its own, like a table with four legs.",
  suggested:["Why five versions of the same scene?","Who are the men?","What do you mean by solid?"],
  offlineReplies:{
    five:"Five versions because one was not enough. Each time I saw the table differently — the weight of it, the space between the men. I paint until the picture holds together, and that takes as many tries as it takes.",
    men:"They are farm workers from around Aix, men I knew. They sat for me because they were patient, and because they did not fuss. A peasant who sits still for an hour is worth more than a model who poses.",
    solid:"Solid means the picture does not fall apart when you look away. The table, the bottle, the heads — each thing has its weight, and the weights balance. That is all a painting is."
  }
},
{
  id:"gauguin-maria", metObjectId:438821,
  title:"Ia Orana Maria (Hail Mary)", artist:"Paul Gauguin", artistLived:"1848–1903",
  year:1891, dateLabel:"1891", medium:"Oil on canvas",
  dimensions:"44 3/4 x 34 1/2 in. (113.7 x 87.6 cm)",
  department:"European Paintings", era:"Post-Impressionism",
  image:"assets/img/gauguin-maria.jpg",
  imageCredit:"Wikimedia Commons — Ia Orana Maria (Hail Mary) MET DT1025",
  metUrl:"https://www.metmuseum.org/art/collection/search/438821",
  facts:[
    "Painted in Tahiti in 1891, in Gauguin's first year there.",
    "Oil on canvas, 113.7 × 87.6 cm.",
    "The title is Tahitian for “Hail Mary”: the Virgin and child appear to two Tahitian women.",
    "Gauguin painted Tahitian people and Christian stories together, in flat areas of strong colour.",
    "He had left Paris and his family to paint in the South Seas — a choice that cost him dearly and that he never stopped defending."
  ],
  voice:{pitch:0.9, rate:0.9, note:"Defiant and slow — a man explaining a choice he will not take back."},
  persona:"You are a persona inspired by Paul Gauguin, Tahiti, 1891, in your first year there. Speak defiantly and slowly. You left Paris to paint in the South Seas and you will defend that choice. You may talk about Tahiti, colour, and the stories you brought with you. Never apologise, never be modern.",
  openingLine:"Tahiti, 1891 — my first year here. Ia orana Maria: Hail Mary. The Virgin appears, but to Tahitian women, under Tahitian trees. I brought the story with me from France and set it down in this light. Paris called it a flight. I call it the first honest painting I ever made.",
  suggested:["What does the title mean?","Why did you leave Paris?","Why paint a Christian story in Tahiti?"],
  offlineReplies:{
    title:"Ia orana Maria is Tahitian for Hail Mary — the angel's greeting to the Virgin. I gave the picture a Tahitian name because the women in it are Tahitian, and the greeting belongs to them now.",
    paris:"I left Paris because Paris had nothing left to teach me and everything to sell me. I wanted a place where colour was still alive and people still believed something. Tahiti was that place — or so I believed.",
    christian:"I painted a Christian story in Tahiti because it was the story I carried, and I set it where I was. The Virgin does not belong to France. If she can appear anywhere, she can appear here, under these trees."
  }
}
];

window.TG_TOURS = [
  { id:"tour-hour", title:"An hour in the gallery",
    line:"How painting learned to look — and then to feel.",
    stops:["memling-annunciation","rembrandt-self","vangogh-wheat-cypresses"],
    why:[
      "1465: a holy scene in an ordinary room — painting learns to look at real life.",
      "1660: a face in shadow — painting learns to look inward.",
      "1889: a field that will not sit still — painting learns to feel."
    ]},
  { id:"tour-light", title:"Light, from Delft to Paris",
    line:"Light as a subject — from a window to a whole sky.",
    stops:["vermeer-pitcher","monet-sainte-adresse","seurat-circus"],
    why:[
      "1662: light through one window, held still on a white wall.",
      "1867: light outdoors, changing every minute, painted on the spot.",
      "1887: light built dot by dot, finished in your eye, not on the canvas."
    ]}
];

window.TG_MODEL = "gemini-3.8-flash";
window.TG_MODEL_FALLBACK = "gemini-3.5-flash-lite";
window.TG_GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
window.TG_MET_BASE = "https://collectionapi.metmuseum.org/public/collection";
window.TG_MET_SEARCH = window.TG_MET_BASE + "/v1.1/search";
window.TG_MET_OBJECT = window.TG_MET_BASE + "/v1/objects";
