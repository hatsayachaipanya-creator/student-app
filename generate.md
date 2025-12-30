Act as a Senior Front-end Developer specializing in Nuxt 3, Tailwind CSS, and TypeScript.

**Task:** Create a functional prototype for a "Student Registration System" web application.

**Tech Stack:**

- **Framework:** Nuxt 3 (Script Setup, TypeScript)
- **Styling:** Tailwind CSS + DaisyUI
- **State Management:** Pinia
- **Data Persistence:** LocalStorage (Using `@pinia-plugin-persistedstate/nuxt`)

**Key Requirements:**

1.  **Configuration (`nuxt.config.ts`):**

    - Setup Tailwind CSS and DaisyUI.
    - Setup Pinia and the PersistedState module to handle LocalStorage automatically.

2.  **State Management (`stores/course.ts`):**

    - **State:**
      - `availableCourses`: Array of mock data (id, code, name, credit, professor, time).
      - `myCourses`: Array of registered courses.
    - **Actions:**
      - `register(course)`: Add course to `myCourses`. Check for duplicates before adding. Check if total credits exceed 22.
      - `drop(courseId)`: Remove course from `myCourses`.
    - **Persistence:** Ensure `myCourses` is saved to LocalStorage automatically using `persist: true`.

3.  **UI/Pages:**
    - **Layout (`layouts/default.vue`):** A responsive Navbar using DaisyUI. Include links to "Course Catalog" and "My Schedule". Show a badge on the "My Schedule" link indicating the number of enrolled courses.
    - **Course Catalog (`pages/index.vue`):** Display courses in a grid using DaisyUI `Card`. Include a "Register" button (change to "Enrolled" and disable button if the user already has this course).
    - **My Schedule (`pages/schedule.vue`):** Display enrolled courses in a DaisyUI `Table`. Show a summary of **Total Credits**. Include a "Withdraw" button (red color) for each row.

**Deliverables:**
Please provide the complete, ready-to-run code for:

1. `nuxt.config.ts`
2. `stores/course.ts`
3. `layouts/default.vue`
4. `pages/index.vue`
5. `pages/schedule.vue`

Ensure the code is clean, modular, and uses the Composition API.
