<?php
//+----------------------------------------------------------------+
//| CONTACT.PHP
//+----------------------------------------------------------------+

session_start();
$response=array();

//+----------------------------------------------------------------+
//| email settings
//+----------------------------------------------------------------+

$to=''; // remove this - emtpy prevent unwanted spam
//$to = "yourmail@yoursite.com"; /* you email address */
$subject ="Contact form message"; /* email subject */
$message ="You received a mail via your website contact form\n\n"; /* email messege prefix */

//+----------------------------------------------------------------+
//| post data validation
//+----------------------------------------------------------------+

if ($_POST) {	
	/* clean input & escape the special chars */
	foreach($_POST as $key=>$value) {
		if(ini_get('magic_quotes_gpc')) { $_POST[$key]=stripslashes($_POST[$key]); }
		$_POST[$key]=htmlspecialchars(strip_tags(trim($_POST[$key])), ENT_QUOTES);
	}	
	/* check name */
	if (!strlen($_POST['name'])) {
		$response['message']['name']="This field is required.";
	}
	/* check email */
	if (!strlen($_POST['email'])) {
		$response['message']['email']="This field is required";
	} elseif (!preg_match("/^[\w-]+(\.[\w-]+)*@([0-9a-z][0-9a-z-]*[0-9a-z]\.)+([a-z]{2,4})$/i", $_POST['email'])) {
		$response['message']['email']="Invalid e-mail address";	
	}
	/* check website (if given) */
	if (strlen($_POST['website']) && !filter_var($_POST['website'], FILTER_VALIDATE_URL)) {
		$response['message']['website']="Invalid url";
	}	
	/* check message */
	if (!strlen($_POST['message'])) {
		$response['message']['message']="This field is required";
	}
	/* check captcha */
	if (!strlen($_POST['captcha'])) {
		$response['message']['captcha']="This field is required";
	} elseif ($_POST['captcha']!=$_SESSION['captcha']) {
		$response['message']['captcha']="Invalid captcha";	
	}			
	/* if no error */
	if (!isset($response['message'])) { $response['result']='success'; } else { $response['result']='error';}
}
	

//+----------------------------------------------------------------+
//| send the email
//+----------------------------------------------------------------+

if ($response['result']) {
	if ($response['result']=='success') {
		
		/* build the email message body */
		$message.= 'Sender name: '.$_POST['name']."\n";
		$message.= 'Sender email: '.$_POST['email']."\n";
		$message.= strlen($_POST['website']) ? 'Sender website: '.$_POST['website']."\n\n" : "Sender website: -\n\n";
		$message.= "Message: \n".$_POST['message'];
		
		/* send the mail */
		if(mail($to, $subject,$message)){
			$response['message']['mail_sent']='Your message has been sent successfully.';
		} else{
			$response['result']='error';
			$response['message']['mail_sent']='Something went wrong, please try again later.';
		}
	}
	/* if ajax request */
	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') { 
		print json_encode($response);
		exit;
	} 
	/* if reqular http request */
	else {
		$_SESSION['reponse']=$response;
		$_SESSION['postdata']=$_POST;
		header('location: '.$_SERVER['PHP_SELF']); 
		exit;
	}
}

//+----------------------------------------------------------------+
//| create session data
//+----------------------------------------------------------------+

$_SESSION['no1'] = rand(1,10);	/* first number */
$_SESSION['no2'] = rand(1,10);	/* second number */
$_SESSION['captcha'] = $_SESSION['no1']+$_SESSION['no2'];	/* captcha data */	
?>
<!DOCTYPE html>
<!-- Granth | Modern Business Template v1.0 -->
<html dir="ltr" lang="en-US">
<head>

<!-- meta tags -->
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="author" content="Granthweb">
<meta name="author-url" content="http://www.granthweb.com">
<meta name="description" content="Modern Business Template">
<meta name="robots" content="index, follow">

<!-- favicon -->
<link rel="icon" href="assets/images/favicon.png" type="image/png">

<!-- page title -->
<title>Granth | Modern Business Template</title>

<!-- css stylesheets -->
<link rel="stylesheet" href="assets/css/style.css" type="text/css" media="all">
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Merriweather" type="text/css" media="all">

<!-- js -->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/scripts.js"></script>
<script type="text/javascript" src="assets/plugin/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="assets/plugin/js/jquery.lavalamp-1.3.5.min.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="assets/plugin/js/jquery.gomap-1.3.2.min.js"></script>
</head>

<body id="top">

<!-- BEGIN #wrapper -->
<div id="wrapper">

    <!-- BEGIN #header -->
    <div id="header" class="wrapper">
        <div class="container clearfix">
        	
            <!-- BEGIN #logo -->
            <div id="logo"><a href="home.html"><img src="assets/images/sitelogo.png" width="222" height="99" alt="Granth"></a></div>
            <!-- END #logo -->
            
            <!-- BEGIN #page-number & #page-info -->
            <div id="page-number">06</div>
            <div id="page-info">
                <div id="page-title">
                    <h1>Contact</h1>
                    <span class="title-desc">Vecu mit erna</span></div>
                <div id="preloader" class="preloader"></div>
            </div>
            <!-- END #page-number & #page-info -->            
            
            <!-- BEGIN #ribbon -->
            <div id="ribbon"></div>
            <!-- END #ribbon -->
            
        </div>
    </div>
    <!-- END #header --> 
    
    <!-- BEGIN #main -->
    <div id="main" class="wrapper">
        <div class="container clearfix"> 
            
            <!-- BEGIN #sidebar -->
            <div id="sidebar" class="aside"> 
                
                <!-- BEGIN #navigation -->
                <ul id="navigation">
                    <li><a href="home.html"><span class="menu-number">00</span> HOME <span class="menu-desc">Pro ut vocent</span></a></li>
                    <li><a href="about.html"><span class="menu-number">01</span> ABOUT <span class="menu-desc">Accusam salutandi</span></a></li>
                    <li class="parent"><a href="#"><span class="menu-number">02</span> PATTERNS <span class="menu-desc">Ad tota mazim</span></a>
                        <ul>
                            <li><a class="loadstyle" href="#">Crossed stripes (reset)</a></li>
                            <li><a class="loadstyle" href="#pattern1.css">Basic crosslines</a></li>
                            <li><a class="loadstyle" href="#pattern2.css">Oblique lines</a></li>
                            <li><a class="loadstyle" href="#pattern3.css">Small dots</a></li>
                            <li><a class="loadstyle" href="#pattern4.css">Simple white &#8226;</a></li>
                            <li><a class="loadstyle" href="#pattern5.css">Mixed lines</a></li>
                            <li><a class="loadstyle" href="#pattern6.css">Vintage flowers</a></li>                            
                        </ul>
                    </li>
                    <li><a href="shortcodes.html"><span class="menu-number">03</span> SHORTCODES <span class="menu-desc">Vix ne cetero</span></a> </li>
                    <li class="parent"><a href="#"><span class="menu-number">04</span> SERVICES <span class="menu-desc">Duo cu eligendi</span></a>
                        <ul>
                            <li><a href="services.html">Services</a></li>
                            <li><a href="404.html">404 page</a></li>
                        </ul>                    
                    </li>
                    <li><a href="blog.html"><span class="menu-number">05</span> BLOG <span class="menu-desc">Et pri nostro</span></a></li>
                    <li class="current"><a href="contact.php"><span class="menu-number">06</span> CONTACT <span class="menu-desc">Vecu mit erna</span></a></li>
                </ul>
                <!-- END #navigation --> 
                
                <!-- BEGIN #searchbox -->
                <div id="searchbox">
                    <form id="searchform" action="result_not_found.html" method="get">
                        <input id="search" name="search" type="text" value="Start searching...">
                        <button id="searchsubmit" type="submit">SEARCH</button>
                    </form>
                </div>
                <!-- END #searchbox --> 
                
                <!-- BEGIN #widgets -->
                <div id="widgets">
                  
                    <!-- BEGIN widget (popular posts) -->
                    <div class="popular-posts widget-container">
                        <div class="widget-header">
                            <h3 class="widget-title">Popular posts</h3>
                        </div>
                        <div class="widget-content">
                            <div class="widget-controls controls"><span class="tooltip" data-id="3"></span><a href="#" class="prev-arrow disabled">prev</a><a href="#" class="next-arrow" data-id="2">next</a></div>
                            
                            <!-- BEGIN .posts -->
                            <ul class="posts">
                            	
                                <!-- BEGIN post -->
                                <li>
                                	<a href="#">
                                        <div class="post-thumb"><img src="content/images/post/widget/pic1.png" width="40" height="40"></div>
                                        <div class="post-title">Post with great lorem...</div>
                                        <div class="post-date">January 23, 2012 - 6:27 pm </div>
                                    </a>
                                </li>
                                <!-- END post -->
                                
                                <!-- BEGIN post -->
                                <li>
                                	<a href="#">
                                        <div class="post-thumb"><img src="content/images/post/widget/pic2.png" width="40" height="40"></div>
                                        <div class="post-title">Et pri iisque apeirian complectitur, site veri...</div>
                                        <div class="post-date"> January 11, 2012 - 4:54 pm </div>
                                    </a>
                                </li>
                                <!-- END post -->
                                
                                <!-- BEGIN post -->
                                <li>
                                	<a href="#">
                                        <div class="post-thumb"><img src="content/images/post/widget/pic3.png" width="40" height="40"></div>
                                        <div class="post-title">Id qui labitur feugiat atomorum, ex eos doming disputando...</div>
                                        <div class="post-date"> January 9, 2012 - 2:12 pm </div>
                                    </a>
                                </li>
                                <!-- END post -->
                                
                            </ul>
                            <!-- END .posts -->
                            
                        </div>
                    </div>
                    <!-- END widget (popular posts) -->
                    
                    <!-- BEGIN widget (text widget) -->
                    <div class="widget-container">
                        <div class="widget-header">
                            <h3 class="widget-title">Work with us</h3>
                        </div>
                        <div class="widget-content"><img src="assets/images/avatars/admin.png" width="40" height="40" class="admin alignleft">Mazim vitae postulan cu nam, esse nonumy sed ex, at lorem reprin iquen suscipiantur his. Eum ea tat sature dolores inciderint, intu habemus apeirian est, minimel.<a href="#" class="widget-link">Drop us a line</a></div>
                    </div>
                   <!-- END widget widget (text widget) -->
                   
                </div>
                <!-- END #widgets -->
                
            </div>
            <!-- END #sidebar --> 
            
            <!-- BEGIN #main-content -->
			<div id="main-content" class="content clearfix"> 
            
                <!-- BEGIN CONTACT page content -->
                <div class="inner-content">
                    <div class="section clearfix">
                        <div class="fleft">
                            <h2 class="title outer-bordered">Contact details</h2>
                            <h6 class="space-10">Address Info</h6>
                            <p class="space-10">1234 Address City, TS 56789<br>
                                City, Country</p>
                            <p class="space-10">Tel: +01 2345 678<br>
                                Fax : +01 2345 679 <br>
                                E-mail: <a href="mailto:hello@yoursite.com">hello@yoursite.com</a></p>
                        </div>
                        <div class="fright">
                            <h2 class="title">Our location</h2>
                            <div class="image-frame nspace-20">
                                <div id="map"></div>
                            </div>
                        </div>
                    </div>
                    <hr class="separator">
                    <div class="section clearfix">
                        <h2 class="title outer-bordered">Get in touch!</h2>
                        <p>Splendide philosophia et est, cum at probo minimum omnesque, falli libris has id. Ad facer pertinax vel, eum ne molestie euripidis consectetuer. Tale noluisse signiferumque te vix, graecis evertitur temporibus his ut, vis ne nulla nemore splendide. Salutandi scribentur efficiantur ad his, aliquam deleniti salutandi ius id. </p>
						<?php
						if (isset($_SESSION['reponse']) && $_SESSION['reponse']['result']=='success') { ?>
                        <p class="success"><?php echo $_SESSION['reponse']['message']['mail_sent']; ?></p>
                        <?php
							unset($_SESSION['reponse']);
							unset($_SESSION['postdata']);
						?>
                        <?php } elseif ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['mail_sent'])) { ?>
						<p class="error"><?php echo '-'.$_SESSION['reponse']['message']['mail_sent']; ?></p>
						<?php } ?>
                        
                        <!-- BEGIN #contact-form -->
                        <form id="contact-form" name="contact-form" method="post" action="contact.php">
                            <fieldset>
                                <p<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['name'])) { echo ' class="space-10"'; } ?>>
                                    <input id="name" name="name" type="text" value="<?php echo $_SESSION['postdata']['name']; ?>" tabindex="1" class="text-input left<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['name'])) { echo ' error'; } ?>">
                                    <label for="name">Name <span>*</span></label>                                    
                                </p>
								<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['name'])) { ?><p class="error"><?php echo $_SESSION['reponse']['message']['name']; ?></p><?php } ?>                                
                                <p<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['email'])) { echo ' class="space-10"'; } ?>>
                                    <input id="email" name="email" type="text" value="<?php echo $_SESSION['postdata']['email']; ?>" tabindex="2"  class="text-input left<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['email'])) { echo ' error'; } ?>">
                                    <label for="email">E-mail (will not be published) <span>*</span></label>
                                </p>
                                <?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['email'])) { ?><p class="error"><?php echo $_SESSION['reponse']['message']['email']; ?></p><?php } ?>
                                <p<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['website'])) { echo ' class="space-10"'; } ?>>
                                    <input id="website" name="website" type="text" value="<?php echo $_SESSION['postdata']['website']; ?>" tabindex="3"  class="text-input left<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['website'])) { echo ' error'; } ?>">
                                    <label for="website">Website (e.g. http://yoursite.com) </label>
                                </p>
								<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['website'])) { ?><p class="error"><?php echo $_SESSION['reponse']['message']['website']; ?></p><?php } ?>                                
                                <p<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['message'])) { echo ' class="space-10"'; } ?>>
                                    <textarea id="message" name="message" tabindex="4" class="text-area<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['message'])) { echo ' error'; } ?>"><?php echo $_SESSION['postdata']['message']; ?></textarea>
                                </p>
                                <?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['message'])) { ?><p class="error"><?php echo $_SESSION['reponse']['message']['message']; ?></p><?php } ?>
                               	<p class="nspace-20">
                                    <span class="fleft"><button id="contact-submit" name="contact-submit" type="submit" class="submit-button">Send E-mail</button></span>
                                    <span class="fright"><label for="captcha">Are you human?&nbsp;&nbsp;</label><span id="captcha-value" class="captcha"><?php echo $_SESSION['no1']; ?> + <?php echo $_SESSION['no2']; ?> =</span><input id="captcha" name="captcha" type="text" value="" tabindex="5" class="text-input small right<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['captcha'])) { echo ' error'; } ?>"></span>
                                </p>
								<?php if ($_SESSION['reponse']['result']=='error' && isset($_SESSION['reponse']['message']['captcha'])) { ?><div class="clear"></div><div class="space-10"></div><p class="no-space tright error"><?php echo $_SESSION['reponse']['message']['captcha']; ?></p><?php } ?>                                                             
                            </fieldset>
                        </form>
                        <!-- END #contact-form -->
                       
                        <?php
						unset($_SESSION['reponse']);
						unset($_SESSION['postdata']);
						?>
                    </div>
                </div>
				<div class="space-20"></div>
                <!-- END CONTACT page content -->
                
            </div>   
            <!-- END #main-content --> 
            
        </div>
    </div>
    <!-- END #main --> 
    
    <!-- BEGIN #footer -->
    <div id="footer" class="wrapper">
        <div class="container clearfix">
            <div class="content">
                <p id="copyright" class="bordered fleft"> &copy; Copyright Granth MBT / Exclusively at ThemeForest<br>
                    Granth MBT Theme by <a href="http://www.granthweb.com" target="_blank">Granth</a></p>
                <p id="social" class="bordered fright">Follow us on <a href="http://www.facebook.com/granthweb" target="_blank">Facebook</a>, <a href="#">Forrst</a> or <a href="http://twitter.com/intent/follow?screen_name=GranthWeb" target="_blank">Twitter</a></p>
            </div>
            <div id="scroll-top"><a href="#top"></a>Scroll to top</div>
        </div>
    </div>
    <!-- END #footer -->
    
</div>
<!-- END #wrapper -->

</body>
</html>