document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const menuToggleIcon = menuToggle.querySelector('i');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu and icon
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('show');
        const isExpanded = nav.classList.contains('show');
        menuToggle.setAttribute('aria-expanded', isExpanded); // For accessibility
        if (isExpanded) {
            menuToggleIcon.classList.remove('fa-bars');
            menuToggleIcon.classList.add('fa-times');
        } else {
            menuToggleIcon.classList.remove('fa-times');
            menuToggleIcon.classList.add('fa-bars');
        }
    });

    // Smooth scrolling for main navigation anchor links only
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Pastikan ini adalah link navigasi utama (dimulai dengan '#'),
            // bukan link ke halaman eksternal seperti pages/tjkt.html
            if (targetId.startsWith('#')) {
                e.preventDefault(); // Mencegah default jika target ditemukan

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Jika link adalah #home, scroll ke paling atas
                    if (targetId === '#home') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        // Untuk section lain, hitung offset agar tidak tertutup header
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const offset = headerHeight > 0 ? headerHeight : 80; // Default 80px if header not found

                        window.scrollTo({
                            top: targetElement.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }

                    // Tutup menu mobile jika terbuka setelah link diklik
                    if (nav.classList.contains('show')) {
                        nav.classList.remove('show');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggleIcon.classList.remove('fa-times');
                        menuToggleIcon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Add active class to current section in navigation on scroll
    let throttleTimer;
    const throttleDelay = 100; // Mengurangi frekuensi event scroll

    window.addEventListener('scroll', function() {
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                const scrollPosition = window.scrollY;
                const headerHeight = document.querySelector('header').offsetHeight;
                const offset = headerHeight > 0 ? headerHeight : 80;

                document.querySelectorAll('section').forEach(section => {
                    // Sesuaikan offset agar section tepat di bawah header
                    const sectionTop = section.offsetTop - offset - 20; // Tambahan 20px untuk margin
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        const currentLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                        if (currentLink) {
                            currentLink.classList.add('active');
                        }
                    }
                });

                // Handle active class for the very top of the page (Home)
                if (window.scrollY === 0) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    document.querySelector('nav ul li a[href="#home"]')?.classList.add('active');
                }

                throttleTimer = null; // Reset timer
            }, throttleDelay);
        }
    });

    // Set initial active link on page load
    window.dispatchEvent(new Event('scroll'));
});