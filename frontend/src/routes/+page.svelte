<h1>Dashboard</h1>
<hr />

<section id="announcements-box">
  <h2>Announcements</h2>
  <p id="announcement-text">Nothing to show...</p>
</section>

<section id="widgets">
  <article class="widget">
    <h2>Attendance</h2>
    <hr />
  </article>

  <article class="widget">
    <h2>Pulse</h2>
    <hr />
  </article>
</section>

<style>
  h1 {
    margin-bottom: 8px;
  }

  /* Announcements box styling */
  #announcements-box {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    margin-top: 20px;
  }

  #announcement-text {
    border: 1px solid #ddd;
    background: #f7f7f7;
    padding: 20px;
    text-align: center;
    border-radius: 6px;
    margin-top: 20px;
  }

  /* Widgets container */
  #widgets {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }

  /* Individual widget cards */
  .widget {
    flex: 1;
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    min-height: 200px;
  }

  h2 {
    margin-top: 0;
    text-align: center;
    font-size: 1em;
    padding: 0;
  }

  p {
    font-size: 0.7em;
  }
</style>
