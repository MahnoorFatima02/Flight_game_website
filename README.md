# Pilot Rescue Challenge - Python Game

## Overview
Welcome to **Pilot Rescue Challenge**, an exciting strategy game where you play as a pilot on a mission to save **5000 people** while navigating through different challenges. 

You'll have **5 airports** to complete this mission, but be careful! Each airport has a limited number of people to rescue, and you must manage your **fuel and money wisely** to reach the right locations.

## Game Mechanics
- **Start with:**
  - **Fuel:** 3000 units
  - **Money:** 2000 credits
  - **Initial Location:** EFHK (Starting Airport)
- **Goal:** Save 5000 people within 5 airports.
- **Fuel Efficiency:** 0.8 (Fuel consumption depends on distance traveled)
- **Challenges:**
   - Some airports might **rob** the pilot by giving option of chosing between half your money or half fuel efficency. 
   - Other airports might **reward** the pilot by giving option of chosing between with fuel efficency or money.
- **Strategy Required:**
  - Choose airports **wisely** to save fuel.
  - Manage money to buy additional fuel when needed.
  - Avoid risky airports that could set back your progress.

## Game Flow
1. **Choose an airport to travel to** (each with a different number of people to save).
2. **Onboard passengers and save them.**
3. **Manage fuel & money** carefully.
4. **Face unexpected twists:** Gain rewards or lose points at random airports.
5. **Complete the mission in 5 airports** or fail due to poor resource management.

## Installation & Running the Game
1. Clone the repository:
   
   ```bash
   git clone https://github.com/your-repo/pilot-rescue-game.git
   cd pilot-rescue-game
   ```

2. Install dependencies (if required):
   
   ```bash
   pip install -r requirements.txt
   ```

3. Run the game:
   
   ```bash
   python app.py
   ```

## Future Enhancements
- More dynamic airports with different challenges.
- Additional difficulty levels.
- Improved AI for better airport selection strategy.
