import os
import subprocess

def create_logo_16_9_svg():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#02050A"/>
      <stop offset="50%" stop-color="#050B14"/>
      <stop offset="100%" stop-color="#000205"/>
    </linearGradient>

    <!-- Blue Bubble 3D Gradients -->
    <linearGradient id="blueBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="45%" stop-color="#0099FF"/>
      <stop offset="85%" stop-color="#0066CC"/>
      <stop offset="100%" stop-color="#004499"/>
    </linearGradient>
    <linearGradient id="blueHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#BAE6FD" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.0"/>
    </linearGradient>

    <!-- Cyan Mascot (R) Gradients -->
    <linearGradient id="cyanBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="40%" stop-color="#00C9A7"/>
      <stop offset="85%" stop-color="#009E86"/>
      <stop offset="100%" stop-color="#007A67"/>
    </linearGradient>
    <linearGradient id="cyanHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#A7F3D0" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#2DD4BF" stop-opacity="0.0"/>
    </linearGradient>

    <!-- Purple Character Inside O -->
    <linearGradient id="purpleBlob" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="60%" stop-color="#7E22CE"/>
      <stop offset="100%" stop-color="#581C87"/>
    </linearGradient>

    <!-- Golden Sparks Gradient -->
    <linearGradient id="goldSpark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="60%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>

    <!-- Shadows & 3D Extrusion Filters -->
    <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.75"/>
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#021B3D" flood-opacity="0.9"/>
    </filter>
    <filter id="cyanShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.75"/>
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#004D40" flood-opacity="0.9"/>
    </filter>
    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1600" height="900" fill="url(#bgGrad)"/>

  <!-- Subtle Ambient Glow Behind Wordmark -->
  <circle cx="800" cy="460" r="450" fill="#0284C7" opacity="0.12" filter="blur(60px)"/>
  <circle cx="280" cy="450" r="280" fill="#00C9A7" opacity="0.1" filter="blur(50px)"/>
  <circle cx="1340" cy="420" r="220" fill="#F59E0B" opacity="0.12" filter="blur(40px)"/>

  <!-- ======================================================== -->
  <!-- 1. LETTER "R" - CYAN 3D CARTOON MASCOT                   -->
  <!-- ======================================================== -->
  <g id="letter-R-mascot" filter="url(#cyanShadow)">
    <!-- Deep Outline / Shadow Base -->
    <path d="M 170 650 
             C 170 670, 190 680, 210 675 
             C 230 670, 240 650, 240 620 
             L 240 520 
             L 280 520 
             C 300 520, 310 530, 325 560 
             L 365 640 
             C 380 670, 410 680, 440 665 
             C 470 650, 475 620, 455 585 
             L 410 505 
             C 395 480, 420 460, 440 435 
             C 475 390, 480 300, 410 240 
             C 350 190, 250 190, 180 230 
             C 140 255, 130 285, 120 310 
             C 110 335, 125 355, 150 350 
             C 165 345, 170 330, 180 305 
             L 180 610 
             C 175 630, 170 640, 170 650 Z" 
          fill="#004D40" stroke="#012420" stroke-width="26" stroke-linejoin="round"/>

    <!-- Mascot Body Fill -->
    <path d="M 180 640 
             C 180 655, 195 665, 210 660 
             C 225 655, 230 640, 230 610 
             L 230 490 
             L 290 490 
             C 315 490, 330 505, 345 535 
             L 385 615 
             C 400 645, 425 655, 445 645 
             C 465 635, 465 610, 450 580 
             L 405 500 
             C 385 465, 410 445, 430 420 
             C 460 380, 460 305, 400 255 
             C 345 210, 260 210, 200 245 
             C 180 255, 180 280, 180 310 
             L 180 640 Z" 
          fill="url(#cyanBase)"/>

    <!-- Mascot Antenna 1 (Left top) -->
    <path d="M 230 210 C 220 160, 190 145, 175 160 C 160 175, 175 200, 210 220 Z" fill="url(#cyanBase)" stroke="#012420" stroke-width="12"/>
    <ellipse cx="180" cy="165" rx="8" ry="8" fill="#FFFFFF" opacity="0.8"/>

    <!-- Mascot Antenna 2 (Right top) -->
    <path d="M 280 205 C 290 150, 325 140, 340 155 C 355 170, 335 200, 300 215 Z" fill="url(#cyanBase)" stroke="#012420" stroke-width="12"/>
    <ellipse cx="330" cy="155" rx="8" ry="8" fill="#FFFFFF" opacity="0.8"/>

    <!-- Inner Loop Hole of R -->
    <ellipse cx="285" cy="360" rx="42" ry="46" fill="#02050A" stroke="#004D40" stroke-width="16"/>

    <!-- Upper Loop Candy Gloss Highlight -->
    <path d="M 225 240 C 280 220, 370 230, 410 270 C 430 290, 440 330, 430 360 C 420 340, 400 300, 360 270 C 320 240, 260 235, 225 240 Z" 
          fill="url(#cyanHighlight)"/>
    <ellipse cx="250" cy="245" rx="35" ry="10" transform="rotate(-15 250 245)" fill="#FFFFFF" opacity="0.75"/>

    <!-- Mascot Eyes (Big Friendly Cartoon Style) -->
    <!-- Left Eye -->
    <g id="eye-left">
      <ellipse cx="255" cy="335" rx="38" ry="46" fill="#FFFFFF" stroke="#012420" stroke-width="10"/>
      <ellipse cx="265" cy="330" rx="22" ry="26" fill="#0F172A"/>
      <ellipse cx="272" cy="320" rx="9" ry="11" fill="#FFFFFF"/>
      <ellipse cx="258" cy="340" rx="4" ry="4" fill="#FFFFFF"/>
    </g>

    <!-- Right Eye -->
    <g id="eye-right">
      <ellipse cx="340" cy="345" rx="42" ry="50" fill="#FFFFFF" stroke="#012420" stroke-width="10"/>
      <ellipse cx="350" cy="340" rx="24" ry="28" fill="#0F172A"/>
      <ellipse cx="358" cy="330" rx="10" ry="12" fill="#FFFFFF"/>
      <ellipse cx="342" cy="352" rx="4.5" ry="4.5" fill="#FFFFFF"/>
    </g>

    <!-- Cute Blush Cheeks -->
    <ellipse cx="215" cy="385" rx="16" ry="10" fill="#F43F5E" opacity="0.35"/>
    <ellipse cx="395" cy="395" rx="18" ry="11" fill="#F43F5E" opacity="0.35"/>

    <!-- Bottom Tentacle Feet Details -->
    <ellipse cx="205" cy="655" rx="18" ry="10" fill="#004D40" opacity="0.5"/>
    <ellipse cx="445" cy="640" rx="20" ry="12" fill="#004D40" opacity="0.5"/>
  </g>

  <!-- ======================================================== -->
  <!-- 2. LETTER "A" - 3D GLOSSY SKY BLUE BUBBLE                -->
  <!-- ======================================================== -->
  <g id="letter-A" filter="url(#shadow3D)">
    <!-- Base Shadow Stroke -->
    <path d="M 525 210 
             C 555 210, 580 230, 600 270 
             L 685 570 
             C 695 610, 680 645, 650 655 
             C 620 665, 590 645, 580 610 
             L 560 540 
             L 470 540 
             L 450 610 
             C 440 645, 410 665, 380 655 
             C 350 645, 335 610, 345 570 
             L 430 270 
             C 450 230, 485 210, 525 210 Z" 
          fill="#021B3D" stroke="#031024" stroke-width="26" stroke-linejoin="round"/>

    <!-- Fill -->
    <path d="M 525 220 
             C 550 220, 570 240, 588 275 
             L 673 575 
             C 680 605, 668 635, 642 642 
             C 618 648, 595 632, 588 605 
             L 568 535 
             L 462 535 
             L 442 605 
             C 435 632, 412 648, 388 642 
             C 362 635, 350 605, 357 575 
             L 442 275 
             C 460 240, 490 220, 525 220 Z" 
          fill="url(#blueBase)"/>

    <!-- Inner Triangle Hole -->
    <path d="M 515 325 L 545 445 L 485 445 Z" fill="#02050A" stroke="#021B3D" stroke-width="16" stroke-linejoin="round"/>

    <!-- Top & Left Candy Gloss Highlights -->
    <ellipse cx="518" cy="245" rx="38" ry="14" fill="#FFFFFF" opacity="0.85"/>
    <path d="M 445 285 L 385 510 C 380 530, 395 530, 400 515 L 460 300 Z" fill="url(#blueHighlight)"/>
  </g>

  <!-- ======================================================== -->
  <!-- 3. LETTER "S" - 3D GLOSSY SKY BLUE BUBBLE                -->
  <!-- ======================================================== -->
  <g id="letter-S" filter="url(#shadow3D)">
    <!-- Base Shadow -->
    <path d="M 830 300 
             C 830 245, 785 210, 720 210 
             C 645 210, 600 250, 600 320 
             C 600 420, 780 400, 780 480 
             C 780 530, 740 560, 680 560 
             C 625 560, 595 530, 590 480 
             C 588 450, 560 435, 530 440 
             C 500 445, 485 475, 490 510 
             C 505 595, 580 660, 685 660 
             C 790 660, 880 605, 880 490 
             C 880 380, 700 395, 700 325 
             C 700 285, 730 265, 770 265 
             C 805 265, 825 285, 830 310 
             C 835 335, 860 350, 885 340 
             C 910 330, 920 300, 915 280 
             C 900 240, 865 210, 830 300 Z" 
          fill="#021B3D" stroke="#031024" stroke-width="26" stroke-linejoin="round"/>

    <!-- Fill -->
    <path d="M 820 305 
             C 820 255, 778 220, 720 220 
             C 655 220, 612 258, 612 320 
             C 612 410, 792 390, 792 480 
             C 792 522, 748 550, 685 550 
             C 630 550, 602 520, 598 480 
             C 596 455, 575 442, 550 447 
             C 525 452, 510 475, 515 505 
             C 528 580, 595 645, 685 645 
             C 780 645, 862 595, 862 490 
             C 862 390, 682 405, 682 325 
             C 682 275, 720 255, 765 255 
             C 800 255, 825 275, 830 305 Z" 
          fill="url(#blueBase)"/>

    <!-- Highlights -->
    <ellipse cx="730" cy="240" rx="65" ry="14" fill="#FFFFFF" opacity="0.85"/>
    <ellipse cx="690" cy="580" rx="60" ry="14" fill="#FFFFFF" opacity="0.6"/>
  </g>

  <!-- ======================================================== -->
  <!-- 4. LETTER "T" - 3D GLOSSY SKY BLUE BUBBLE                -->
  <!-- ======================================================== -->
  <g id="letter-T" filter="url(#shadow3D)">
    <!-- Base Shadow -->
    <path d="M 870 250 
             C 870 225, 895 210, 925 210 
             L 1095 210 
             C 1125 210, 1150 225, 1150 250 
             C 1150 275, 1125 295, 1095 295 
             L 1055 295 
             L 1055 600 
             C 1055 635, 1030 660, 995 660 
             C 960 660, 935 635, 935 600 
             L 935 295 
             L 900 295 
             C 880 295, 870 275, 870 250 Z" 
          fill="#021B3D" stroke="#031024" stroke-width="26" stroke-linejoin="round"/>

    <!-- Fill -->
    <path d="M 880 250 
             C 880 230, 902 220, 930 220 
             L 1090 220 
             C 1118 220, 1140 230, 1140 250 
             C 1140 270, 1118 285, 1090 285 
             L 1045 285 
             L 1045 600 
             C 1045 628, 1022 650, 995 650 
             C 968 650, 945 628, 945 600 
             L 945 285 
             L 910 285 
             C 890 285, 880 270, 880 250 Z" 
          fill="url(#blueBase)"/>

    <!-- Horizontal Bar Highlight -->
    <ellipse cx="1010" cy="235" rx="85" ry="12" fill="#FFFFFF" opacity="0.85"/>
    <rect x="980" y="300" width="18" height="280" rx="9" fill="url(#blueHighlight)"/>
  </g>

  <!-- ======================================================== -->
  <!-- 5. SECOND "R" - 3D GLOSSY SKY BLUE BUBBLE                -->
  <!-- ======================================================== -->
  <g id="letter-R2" filter="url(#shadow3D)">
    <!-- Base Shadow -->
    <path d="M 1130 250 
             C 1130 225, 1155 210, 1185 210 
             L 1270 210 
             C 1335 210, 1375 255, 1375 325 
             C 1375 385, 1340 425, 1290 445 
             L 1345 585 
             C 1358 618, 1342 650, 1312 660 
             C 1282 670, 1252 650, 1240 620 
             L 1195 500 
             L 1195 600 
             C 1195 635, 1170 660, 1145 660 
             C 1120 660, 1105 635, 1105 600 
             L 1105 250 Z" 
          fill="#021B3D" stroke="#031024" stroke-width="26" stroke-linejoin="round"/>

    <!-- Fill -->
    <path d="M 1140 250 
             C 1140 230, 1162 220, 1190 220 
             L 1270 220 
             C 1325 220, 1362 258, 1362 325 
             C 1362 380, 1330 415, 1285 435 
             L 1338 580 
             C 1348 608, 1335 638, 1310 648 
             C 1285 658, 1258 640, 1248 612 
             L 1185 490 
             L 1185 600 
             C 1185 628, 1165 650, 1145 650 
             C 1125 650, 1115 628, 1115 600 
             L 1115 250 Z" 
          fill="url(#blueBase)"/>

    <!-- Loop Counter Hole -->
    <ellipse cx="1235" cy="335" rx="35" ry="38" fill="#02050A" stroke="#021B3D" stroke-width="16"/>

    <!-- Loop Top Candy Gloss Highlight -->
    <ellipse cx="1255" cy="240" rx="55" ry="12" fill="#FFFFFF" opacity="0.85"/>
  </g>

  <!-- ======================================================== -->
  <!-- 6. LETTER "O" - WITH PURPLE CREATURE & SUNBURST SPARKS   -->
  <!-- ======================================================== -->
  <g id="letter-O-and-mascot" filter="url(#shadow3D)">
    <!-- Golden Energy Sunburst Rays from top right of O -->
    <g id="energy-rays" filter="url(#glowGold)">
      <!-- Top Ray -->
      <path d="M 1520 220 C 1530 180, 1550 170, 1565 180 C 1580 190, 1570 220, 1545 240 Z" fill="url(#goldSpark)"/>
      <!-- Diagonal Big Ray -->
      <path d="M 1555 265 C 1595 235, 1615 240, 1625 255 C 1635 270, 1615 295, 1575 295 Z" fill="url(#goldSpark)"/>
      <!-- Lower Ray -->
      <path d="M 1560 325 C 1595 320, 1610 335, 1610 350 C 1610 365, 1585 375, 1550 355 Z" fill="url(#goldSpark)"/>
    </g>

    <!-- Outer Base Shadow of "O" -->
    <ellipse cx="1455" cy="440" rx="125" ry="195" fill="#021B3D" stroke="#031024" stroke-width="26"/>

    <!-- "O" Fill -->
    <ellipse cx="1455" cy="440" rx="115" ry="185" fill="url(#blueBase)"/>

    <!-- Top Highlight on O -->
    <ellipse cx="1455" cy="275" rx="65" ry="16" fill="#FFFFFF" opacity="0.9"/>
    <ellipse cx="1455" cy="605" rx="55" ry="12" fill="#FFFFFF" opacity="0.5"/>

    <!-- Center Hole of "O" (Revealing the inside space) -->
    <ellipse cx="1455" cy="445" rx="52" ry="92" fill="#02050A" stroke="#021B3D" stroke-width="16"/>

    <!-- ======================================================== -->
    <!-- CUTE PURPLE CREATURE PEEKING INSIDE "O"                  -->
    <!-- ======================================================== -->
    <g id="purple-mascot-inside-O">
      <!-- Purple Body -->
      <ellipse cx="1455" cy="485" rx="42" ry="50" fill="url(#purpleBlob)" stroke="#3B0764" stroke-width="8"/>
      
      <!-- Left Antenna -->
      <path d="M 1440 440 C 1432 415, 1420 410, 1415 418 C 1410 426, 1425 435, 1435 445 Z" fill="#A855F7" stroke="#3B0764" stroke-width="4"/>
      <circle cx="1418" cy="415" r="4" fill="#F472B6"/>

      <!-- Right Antenna -->
      <path d="M 1470 440 C 1478 415, 1490 410, 1495 418 C 1500 426, 1485 435, 1475 445 Z" fill="#A855F7" stroke="#3B0764" stroke-width="4"/>
      <circle cx="1492" cy="415" r="4" fill="#F472B6"/>

      <!-- Big Glossy Cartoon Eyes Looking Up-Right -->
      <!-- Left Eye -->
      <ellipse cx="1445" cy="470" rx="12" ry="16" fill="#FFFFFF" stroke="#3B0764" stroke-width="3"/>
      <circle cx="1448" cy="468" r="8" fill="#0F172A"/>
      <circle cx="1450" cy="464" r="3.5" fill="#FFFFFF"/>

      <!-- Right Eye -->
      <ellipse cx="1468" cy="470" rx="12" ry="16" fill="#FFFFFF" stroke="#3B0764" stroke-width="3"/>
      <circle cx="1471" cy="468" r="8" fill="#0F172A"/>
      <circle cx="1473" cy="464" r="3.5" fill="#FFFFFF"/>

      <!-- Cute Smile -->
      <path d="M 1450 492 Q 1456 498 1462 492" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Rosy Cheeks -->
      <circle cx="1436" cy="485" r="5" fill="#F43F5E" opacity="0.5"/>
      <circle cx="1476" cy="485" r="5" fill="#F43F5E" opacity="0.5"/>
    </g>
  </g>
</svg>"""

def create_pwa_icon_svg():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5F3FF"/>
      <stop offset="50%" stop-color="#EDE9FE"/>
      <stop offset="100%" stop-color="#DDD6FE"/>
    </linearGradient>

    <!-- Blue Bubble 3D Gradients -->
    <linearGradient id="pwaBlue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="45%" stop-color="#0099FF"/>
      <stop offset="85%" stop-color="#0066CC"/>
      <stop offset="100%" stop-color="#004499"/>
    </linearGradient>

    <!-- Cyan Mascot Gradients -->
    <linearGradient id="pwaCyan" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="50%" stop-color="#00C9A7"/>
      <stop offset="100%" stop-color="#00897B"/>
    </linearGradient>

    <!-- Book Gradients -->
    <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#6D28D9"/>
    </linearGradient>
    <linearGradient id="bookGlow" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#A78BFA" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#C084FC" stop-opacity="0.0"/>
    </linearGradient>

    <filter id="pwaShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#3B0764" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Rounded Squircle App Icon Background -->
  <rect width="512" height="512" rx="115" fill="url(#iconBg)"/>

  <!-- Decorative Pastel Wave Curves in Background -->
  <path d="M 0 380 Q 140 330 256 370 T 512 360 L 512 512 L 0 512 Z" fill="#E0E7FF" opacity="0.6"/>
  <path d="M 0 420 Q 180 390 320 430 T 512 410 L 512 512 L 0 512 Z" fill="#C7D2FE" opacity="0.4"/>

  <!-- Golden 4-Point Star in Top Right -->
  <g transform="translate(410, 85) scale(0.95)" filter="url(#pwaShadow)">
    <path d="M 0 -28 Q 0 0 28 0 Q 0 0 0 28 Q 0 0 -28 0 Q 0 0 0 -28 Z" fill="#FBBF24"/>
    <circle cx="0" cy="0" r="6" fill="#FFFBEB"/>
  </g>

  <!-- Little Lavender Plus Sign in Top Left -->
  <g transform="translate(75, 110)">
    <rect x="-4" y="-14" width="8" height="28" rx="4" fill="#A855F7" opacity="0.7"/>
    <rect x="-14" y="-4" width="28" height="8" rx="4" fill="#A855F7" opacity="0.7"/>
  </g>

  <!-- Little Fun Sprinkles -->
  <circle cx="110" cy="80" r="5" fill="#38BDF8" opacity="0.8"/>
  <circle cx="445" cy="150" r="4.5" fill="#EC4899" opacity="0.7"/>
  <circle cx="360" cy="65" r="4" fill="#A855F7" opacity="0.7"/>

  <!-- ======================================================== -->
  <!-- 1. CUTE CYAN MASCOT PEEKING FROM BEHIND THE LETTERS      -->
  <!-- ======================================================== -->
  <g id="peeking-mascot" filter="url(#pwaShadow)">
    <!-- Mascot Head Base -->
    <path d="M 180 190 
             C 170 120, 220 70, 280 70 
             C 340 70, 385 115, 380 190 
             Z" 
          fill="url(#pwaCyan)" stroke="#004D40" stroke-width="8"/>

    <!-- Left Antenna -->
    <path d="M 220 85 C 205 50, 185 45, 175 58 C 165 70, 185 85, 210 95 Z" fill="url(#pwaCyan)" stroke="#004D40" stroke-width="6"/>
    <circle cx="180" cy="55" r="6" fill="#FFFFFF" opacity="0.8"/>

    <!-- Right Antenna -->
    <path d="M 330 85 C 345 50, 365 45, 375 58 C 385 70, 365 85, 340 95 Z" fill="url(#pwaCyan)" stroke="#004D40" stroke-width="6"/>
    <circle cx="370" cy="55" r="6" fill="#FFFFFF" opacity="0.8"/>

    <!-- Big Shiny Eyes -->
    <!-- Left Eye -->
    <ellipse cx="240" cy="140" rx="22" ry="28" fill="#FFFFFF" stroke="#004D40" stroke-width="6"/>
    <ellipse cx="246" cy="136" rx="13" ry="16" fill="#0F172A"/>
    <ellipse cx="250" cy="130" rx="5" ry="7" fill="#FFFFFF"/>
    <ellipse cx="242" cy="142" rx="2.5" ry="2.5" fill="#FFFFFF"/>

    <!-- Right Eye -->
    <ellipse cx="305" cy="140" rx="22" ry="28" fill="#FFFFFF" stroke="#004D40" stroke-width="6"/>
    <ellipse cx="311" cy="136" rx="13" ry="16" fill="#0F172A"/>
    <ellipse cx="315" cy="130" rx="5" ry="7" fill="#FFFFFF"/>
    <ellipse cx="307" cy="142" rx="2.5" ry="2.5" fill="#FFFFFF"/>

    <!-- Blushing Cheeks -->
    <ellipse cx="212" cy="165" rx="12" ry="7" fill="#F43F5E" opacity="0.45"/>
    <ellipse cx="332" cy="165" rx="12" ry="7" fill="#F43F5E" opacity="0.45"/>
  </g>

  <!-- ======================================================== -->
  <!-- 2. "ASTRO" 3D CANDY BUBBLE TYPOGRAPHY                    -->
  <!-- ======================================================== -->
  <g id="astro-typography" filter="url(#pwaShadow)">
    <!-- Letter A -->
    <g id="icon-A">
      <path d="M 92 210 C 105 210, 116 218, 124 235 L 158 310 C 162 320, 156 332, 144 336 C 132 340, 120 332, 115 320 L 108 300 L 76 300 L 69 320 C 64 332, 52 340, 40 336 C 28 332, 22 320, 26 310 L 60 235 C 68 218, 79 210, 92 210 Z" 
            fill="url(#pwaBlue)" stroke="#031E42" stroke-width="12" stroke-linejoin="round"/>
      <ellipse cx="92" cy="225" rx="16" ry="6" fill="#FFFFFF" opacity="0.8"/>
    </g>

    <!-- Letter S -->
    <g id="icon-S">
      <path d="M 195 240 C 195 220, 178 210, 160 210 C 138 210, 125 224, 125 245 C 125 278, 185 272, 185 302 C 185 318, 170 330, 150 330 C 132 330, 122 320, 120 305 C 119 295, 110 290, 100 292 C 90 294, 84 304, 86 315 C 92 342, 118 350, 150 350 C 185 350, 215 332, 215 298 C 215 262, 155 268, 155 245 C 155 232, 166 226, 178 226 C 190 226, 198 232, 200 242 C 202 252, 212 258, 222 254 C 230 250, 234 242, 230 232 Z" 
            fill="url(#pwaBlue)" stroke="#031E42" stroke-width="12" stroke-linejoin="round"/>
      <ellipse cx="165" cy="220" rx="18" ry="5" fill="#FFFFFF" opacity="0.8"/>
    </g>

    <!-- Letter T -->
    <g id="icon-T">
      <path d="M 215 225 C 215 215, 224 210, 235 210 L 290 210 C 300 210, 310 215, 310 225 C 310 235, 300 242, 290 242 L 272 242 L 272 320 C 272 332, 262 340, 252 340 C 242 340, 232 332, 232 320 L 232 242 L 215 242 C 205 242, 195 235, 195 225 Z" 
            fill="url(#pwaBlue)" stroke="#031E42" stroke-width="12" stroke-linejoin="round"/>
      <ellipse cx="262" cy="218" rx="26" ry="5" fill="#FFFFFF" opacity="0.8"/>
    </g>

    <!-- Letter R -->
    <g id="icon-R">
      <path d="M 305 220 C 305 212, 314 208, 325 208 L 355 208 C 378 208, 395 222, 395 248 C 395 270, 380 285, 362 292 L 382 322 C 388 332, 382 344, 372 348 C 362 352, 350 344, 345 334 L 328 305 L 328 322 C 328 334, 318 342, 308 342 C 298 342, 290 334, 290 322 L 290 220 Z" 
            fill="url(#pwaBlue)" stroke="#031E42" stroke-width="12" stroke-linejoin="round"/>
      <ellipse cx="340" cy="216" rx="20" ry="5" fill="#FFFFFF" opacity="0.8"/>
    </g>

    <!-- Letter O with Mascot inside -->
    <g id="icon-O">
      <!-- Golden sparks -->
      <path d="M 445 200 C 455 185, 465 185, 470 190 C 475 195, 468 205, 455 210 Z" fill="#FBBF24"/>
      <path d="M 460 215 C 475 205, 485 210, 488 218 C 490 225, 480 232, 468 228 Z" fill="#FBBF24"/>

      <!-- O Body -->
      <ellipse cx="430" cy="275" rx="42" ry="60" fill="url(#pwaBlue)" stroke="#031E42" stroke-width="12"/>
      <ellipse cx="430" cy="275" rx="18" ry="30" fill="#EDE9FE" stroke="#031E42" stroke-width="8"/>
      <ellipse cx="430" cy="225" rx="20" ry="6" fill="#FFFFFF" opacity="0.85"/>

      <!-- Mini Purple Friend Inside O -->
      <ellipse cx="430" cy="285" rx="14" ry="16" fill="#9333EA" stroke="#3B0764" stroke-width="3"/>
      <circle cx="427" cy="282" r="3" fill="#FFFFFF"/>
      <circle cx="433" cy="282" r="3" fill="#FFFFFF"/>
      <circle cx="428" cy="281" r="1.5" fill="#0F172A"/>
      <circle cx="434" cy="281" r="1.5" fill="#0F172A"/>
    </g>
  </g>

  <!-- Paws of Mascot Resting over the Word ASTRO -->
  <ellipse cx="140" cy="210" rx="14" ry="10" fill="url(#pwaCyan)" stroke="#004D40" stroke-width="4"/>
  <ellipse cx="205" cy="210" rx="14" ry="10" fill="url(#pwaCyan)" stroke="#004D40" stroke-width="4"/>

  <!-- ======================================================== -->
  <!-- 3. STYLIZED 3D OPEN BOOK AT BOTTOM (WITH LIGHT BEAM)     -->
  <!-- ======================================================== -->
  <!-- Upward Radiant Light Beam -->
  <polygon points="170,440 256,360 342,440 256,420" fill="url(#bookGlow)"/>

  <g id="open-book" filter="url(#pwaShadow)" transform="translate(0, 30)">
    <!-- Book Purple Spine / Outer Cover -->
    <path d="M 160 410 
             Q 256 425 352 410 
             L 360 435 
             Q 256 455 152 435 
             Z" 
          fill="url(#bookCover)" stroke="#4C1D95" stroke-width="6"/>

    <!-- Left Open Page -->
    <path d="M 164 402 
             Q 210 380 254 404 
             L 254 424 
             Q 210 402 160 422 
             Z" 
          fill="#FFFFFF" stroke="#6D28D9" stroke-width="5"/>
    <line x1="180" y1="402" x2="238" y2="395" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>
    <line x1="185" y1="412" x2="235" y2="405" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>

    <!-- Right Open Page -->
    <path d="M 348 402 
             Q 302 380 258 404 
             L 258 424 
             Q 302 402 352 422 
             Z" 
          fill="#FFFFFF" stroke="#6D28D9" stroke-width="5"/>
    <line x1="274" y1="395" x2="332" y2="402" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>
    <line x1="277" y1="405" x2="327" y2="412" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>

    <!-- Book Center Gold Ribbon Marker -->
    <path d="M 256 405 L 256 438 L 262 444 L 256 448 L 250 444 L 256 438 Z" fill="#F59E0B"/>
  </g>
</svg>"""

def main():
    os.makedirs('public/assets', exist_ok=True)
    
    # Write SVG files
    logo_svg = create_logo_16_9_svg()
    with open('public/assets/rastro-logo-16-9.svg', 'w') as f:
        f.write(logo_svg)
    print("Created public/assets/rastro-logo-16-9.svg")

    pwa_svg = create_pwa_icon_svg()
    with open('public/assets/rastro-pwa-icon.svg', 'w') as f:
        f.write(pwa_svg)
    print("Created public/assets/rastro-pwa-icon.svg")

    # Convert to PNG using ImageMagick
    # 1. 16:9 Logo PNG (1600x900)
    subprocess.run(['convert', '-background', 'none', '-density', '150', 'public/assets/rastro-logo-16-9.svg', 'public/assets/rastro-logo-16-9.png'], check=True)
    print("Generated public/assets/rastro-logo-16-9.png")

    # 2. PWA Icon 512x512 PNG
    subprocess.run(['convert', '-background', 'none', '-resize', '512x512', 'public/assets/rastro-pwa-icon.svg', 'public/assets/rastro-pwa-icon.png'], check=True)
    print("Generated public/assets/rastro-pwa-icon.png")

    # 3. PWA Icon 192x192 PNG
    subprocess.run(['convert', '-background', 'none', '-resize', '192x192', 'public/assets/rastro-pwa-icon.svg', 'public/assets/rastro-pwa-icon-192.png'], check=True)
    print("Generated public/assets/rastro-pwa-icon-192.png")

    # 4. Update LOGOR.png to the new 16:9 logo as well for compatibility
    subprocess.run(['cp', 'public/assets/rastro-logo-16-9.png', 'public/assets/LOGOR.png'], check=True)
    print("Updated public/assets/LOGOR.png with new brand asset")

if __name__ == '__main__':
    main()
