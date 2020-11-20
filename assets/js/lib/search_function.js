(function (window, document) {
	var searchFormFunction = function searchFormFunction() {
		var searchForm = document.querySelector('.js-search-form');
		if (searchForm !== null) {
			searchForm.onsubmit = function (e) {
				e.preventDefault()
			}
			var searchInput = searchForm.querySelector('.js-search-input');
			var searchResult = document.querySelector('.search-results');
			//var noResult =document.querySelector('.no-result');
			var posts = [];
			var urlposts = [];
			searchInput.onfocus = openSearch;
			//	document.querySelector('.suggestText').onblur = closeSearch;
			//	function closeSearch(e){
			//	debugger;
			//	searchResult.classList.remove('visible');
			//noResult.classList.remove('visible');
			//	searchResult.innerHTML = '';

			//}
			function openSearch(e) {

				//alert("dsd")
				if (posts.length == 0 && typeof searchUrl !== 'undefined') {
					fetch(searchUrl)
						.then(function (response) {
							return response.json();
						})
						.then(function (data) {
							posts = data.posts;
							search();
						})



				}
			}



			function search() {
				if (posts !== undefined && posts.length > 0) {
					var options = {
						shouldSort: true,
						tokenize: true,
						matchAllTokens: false,
						threshold: 0.01,
						location: 0,
						distance: 0,
						ignoreLocation: true,
						keys: ['title', 'tags.name', 'plaintext']

					}
					window.fuse = new Fuse(posts, options);


					$('.js-search-input').keyup(function () {
						var searchText = $(this).val().trim();
						if (searchText) {
							var result = window.fuse.search(searchText, options);
							var output = '';
							var language = document.documentElement.lang;

							if (result.length > 0) {
								$(".accordion-content").find('> a').attr("aria-expanded", false);
								$(".accordion-content").find('> a').addClass("collapsed");
								$(".accordion-content").find('> .collapse').removeClass("show");
								result.forEach(function (val, key) {
									//Max show 5 results
									if (key > 5) {
										return false;
									}

									val = val.item;
									// var pubDate = new Date(val.published_at).toLocaleDateString(language, {
									// 	day: 'numeric',
									// 	month: 'long',
									// 	year: 'numeric'
									// })
									var tag = val.primary_tag === null ? '' : '- ' + val.primary_tag.name;
									var exceRpt = val.excerpt === null ? '' : val.excerpt;								
									var isFaqSection = false;
									var isFaqContent = false;
									var isTutorialsBody = false;
									if (val.tags && val.tags.length > 0) {
										for (var tagsIndex in val.tags) {
											
											if (val.tags[tagsIndex].slug == 'faq-body') {
												if (val.featured) {
													isFaqSection = true;
												} else {
													isFaqContent = true;
												}
												break;
											}else if ( tag.slug == 'tutorials-body')
											{
												isTutorialsBody = true;
												break;
											}
										}
									}
								
									var faqtag = val.tags.length > 1?val.tags[1]:false;
									if(isTutorialsBody)
									{
										output += '<div id="' + val.id + '" class="result-item">';
										var title = val.meta_title?val.meta_title:val.title;
										output += '<a href="' + val.url.replace("http://localhost:2368", "") + '"><b>' + title + "</b></a>";
										contenturl = val.url.replace("http://localhost:2368", "");

										var textlink = exceRpt.substring(exceRpt.indexOf('['), exceRpt.indexOf(']') + 1);
										output += '<div class="excerpt"><a href="' + contenturl + '">' + exceRpt.replace(textlink, "") + '</a></div>';
										output += '</div>';

									}
									else if (val.tags.length == 1 && !faqtag) {
										//Fixed FAQ Body  posts which not set sub tag only FAQ Body tag,  those type of post does not show
										// if (isFaqSection || isFaqContent) {
										// 	output += '';
										// }

									} else {
										output += '<div id="' + val.id + '" class="result-item">';
										var excerpturl = val.url.replace("http://localhost:2368", "");
									
										excerpturl = window.global_tag_pageUrl_table[faqtag.slug];
										var contenturl = "";
										if (isFaqSection || isFaqContent) {

											if (isFaqSection) {
												output += '<a href="' + excerpturl + '#fqs_' + val.title + '"><b>' + val.title + "</b></a>";
												contenturl = excerpturl + '#fqs_' + val.title;

											} else {
												output += '<a href="' + val.meta_title + '?block=' + val.id + '"><b>' + val.title + "</b></a>";
												contenturl = val.meta_title + '?block=' + val.id;
											}



										} else {
											output += '<a href="' + val.url.replace("http://localhost:2368", "") + '"><b>' + val.title + "</b></a>";
											contenturl = val.url.replace("http://localhost:2368", "");
										}
										var textlink = exceRpt.substring(exceRpt.indexOf('['), exceRpt.indexOf(']') + 1);
										output += '<div class="excerpt"><a href="' + contenturl + '">' + exceRpt.replace(textlink, "") + '</a></div>';
										output += '</div>';
									}


								});
								//noResult.classList.remove('visible');
								searchResult.classList.add('visible');
								searchResult.innerHTML = output;

								$(".search-results a").click(function () {
									searchResult.classList.remove('visible');
									searchResult.innerHTML = '';

								});


							} else {
								//noResult.classList.add('visible');
								searchResult.classList.remove('visible');
								searchResult.innerHTML = '';
							}

						} else {
							searchResult.classList.remove('visible');
							//noResult.classList.remove('visible');
							searchResult.innerHTML = '';
						}

					});
					/* 				searchInput.onkeyup = function () {
										var inputKey1 = this.value;
										return;
										if (this.value.length > 0) {
											var result = fuse.search(this.value, options);
											var output = '';
											var language = document.documentElement.lang;
											if (result.length > 0) {
												$(".accordion-content").find('> a').attr("aria-expanded",false);
												$(".accordion-content").find('> a').addClass("collapsed");
												$(".accordion-content").find('> .collapse').removeClass("show");
												result.forEach(function (val, key) {
													//Max show 5 results
													if(key > 5){
														return false;
													}
													
													val = val.item;
													var pubDate = new Date(val.published_at).toLocaleDateString(language, {
														day: 'numeric',
														month: 'long',
														year: 'numeric'
													})
													var tag = val.primary_tag === null ? '' : '- ' + val.primary_tag.name;
												   
												
													var exceRpt = val.excerpt === null ? '' : val.excerpt;
													output += '<div id="' + val.id + '" class="result-item">';
													output += '<a href="' + val.meta_title + '"><b>'+val.title+"</b></a>";
													output += '<div class="excerpt">' + exceRpt+ '</div>';
													output += '</div>';
											
													$(".accordion-content").each(function(){
														
														var hh=$(this).find('> a > span').html();
														if($(this).find('> a > span').html() == val.title)	
														{
														
															$(this).find('> a').attr("aria-expanded",true);
															$(this).find('> a').removeClass("collapsed");
															$(this).find('> .collapse').addClass("show");
														}
				
													})
												});
												//noResult.classList.remove('visible');
												searchResult.classList.add('visible');
												searchResult.innerHTML = output;
											} else {
												//noResult.classList.add('visible');
												searchResult.classList.remove('visible');
												searchResult.innerHTML = '';
											}
										} else {
											searchResult.classList.remove('visible');
											//noResult.classList.remove('visible');
											searchResult.innerHTML = '';
										}
									} */


				}
			}

			searchInput.addEventListener('focus', function () {
				if (searchInput.value !== undefined && searchInput.value !== '') {
					if (searchResult.innerHTML) {
						searchResult.classList.add('visible');
					} else {
						//noResult.classList.add('visible');
					}
				}
			});
			searchInput.addEventListener('blur', function () {
				document.addEventListener('click', hideResult);
				function hideResult(e) {
					if (!searchResult.contains(e.target)) {
						searchResult.classList.remove('visible');
						//noResult.classList.remove('visible');
						console.log('hello')
						document.removeEventListener('click', hideResult);
					}
				}
			});
		}
	};

	document.addEventListener('DOMContentLoaded', searchFormFunction);
})(window, document);


