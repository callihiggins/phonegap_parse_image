var parseAPPID = "4vXjdWh1ie5TucasSJUvpRPN20qW2WgTdvlyz9aA";
var parseJSID = "A1R9jdzqJwOKQo2qkW512ZJxSVxYducJpvrhzp3c";



//Initialize Parse
Parse.initialize(parseAPPID,parseJSID);

var NoteOb = Parse.Object.extend("Note");

$(document).on("pageshow", "#home", function(e, ui) {
             
               $.mobile.loading("show");
               
               var query = new Parse.Query(NoteOb);
               query.limit(10);
               query.descending("createdAt");
               
               query.find({
                          success:function(results) {
                          $.mobile.loading("hide");
                          var s = "";
                          for(var i=0; i<results.length; i++) {
                          //Lame - should be using a template
                          s += "<p>";
                          s += "<h3>Note " + results[i].createdAt + "</h3>";
                          s += results[i].get("text");
                          var pic = results[i].get("picture");
                          if(pic) {
                          s += "<br/><img src='" + pic.url() + "'>";
                          }
                          s += "</p>";
                          }
                          $("#home div[data-role=content]").html(s);
                          },error:function(e) {
                          $.mobile.loading("hide");
                          
                          }
                          });
               });

$(document).on("pageshow", "#addNote", function(e, ui) {
               
               var imagedata = "";
               
               $("#saveNoteBtn").on("touchend", function(e) {
                                    e.preventDefault();
                                    $(this).attr("disabled","disabled").button("refresh");
                                    var noteText = $("#noteText").val();
                                    console.log("data" + imagedata);
                                    
                                    /*
                                     A bit complex - we have to handle an optional pic save
                                     */
                                    if(imagedata != "") {
                                    var parseFile = new Parse.File("mypic.jpg", {base64:imagedata});
                                    console.log(parseFile);
                                    parseFile.save().then(function() {
                                                          var note = new NoteOb();
                                                          note.set("text",noteText);
                                                          note.set("picture",parseFile);
                                                          note.save(null, {
                                                                    success:function(ob) {
                                                                    $.mobile.changePage("#home");
                                                                    }, error:function(e) {
                                                                    console.log("Oh crap", e);
                                                                    }
                                                                    });
                                                          cleanUp();
                                                          }, function(error) {
                                                          console.log("Error");
                                                          console.log(error);
                                                          });
                                    
                                    } else {
                                    var note = new NoteOb();
                                    note.set("text",noteText);
                                    note.save(null, {
                                              success:function(ob) {
                                              $.mobile.changePage("#home");
                                              }, error:function(e) {
                                              console.log("Oh crap", e);
                                              }
                                              });
                                    cleanUp();
                                    
                                    }
                                    });
               
               $("#takePicBtn").on("click", function(e) {
                                   e.preventDefault();
                                   
                                   if (!navigator.camera) {
                                   alert("Camera API not supported", "Error");
                                   return;
                                   } else{
                                   navigator.camera.getPicture(gotPic, failHandler, {quality:50,
                                                               destinationType : Camera.DestinationType.DATA_URL,
                                                               sourceType : Camera.PictureSourceType.CAMERA,
                                                               saveToPhotoAlbum: false
                                                               });
                                   }
                                   });
               
               function gotPic(data) {
              // console.log('got here');
               imagedata = data;
               $("#takePicBtn").text("Picture Taken!").button("refresh");
               }
               
               function failHandler(e) {
//               alert("ErrorFromC");
//               alert(e);
               console.log(e.toString());
               }
               
               function cleanUp() {
               imagedata = "";
               $("#saveNoteBtn").removeAttr("disabled").button("refresh");
               $("#noteText").val("");
               $("#takePicBtn").text("Add Pic").button("refresh");
               }
               
               });