// Bắt đầu thực hiện khi DOM được load hoàn thành
window.onload = function() {
    // Lấy file, audio và canvas element
var fileElm = document.querySelector("#input-file");
var audioElm = document.querySelector("#audio");
var canvasElm = document.querySelector("canvas");
canvasElm.width = window.innerWidth;
canvasElm.height = window.innerHeight;
    
// Thực hiện xử lý khi một file audio được chọn
fileElm.onchange = function() {
  // Gắn đường source cho audio element với file đầu tiên trong danh sách các file đã chọn
  // File object thường là 1 array do input type file có thể chấp nhận thuộc tính multple
  // để chúng ta có thể chọn nhiều hơn một file. URL.createObjectURL sẽ giúp chúng ta tạo ra một
  // DOMString chứa URL đại diện cho Object được đưa vào. Bạn có thể xem chi tiết tại: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  audioElm.src = URL.createObjectURL(this.files[0]);
  
  // Tiếp theo, tải file và thực hiện play file đã được chọn
  audioElm.load();
  audioElm.play();
  
  // Tiếp, khởi tạo AudioContext
  var audioContext = new AudioContext();
  // Khởi tạo AudioContext source
  var audioContextSrc = audioContext.createMediaElementSource(audio);
  // Khởi tạo Analyser
  var audioAnalyser = audioContext.createAnalyser();
  // Khởi tạo 2D canvas
  canvasContext = canvasElm.getContext("2d");
  
  // Kết nối AudioContext source với Analyser
  audioContextSrc.connect(audioAnalyser);
  // Kết nối Analyser với AudioDestinationNode
  audioAnalyser.connect(audioContext.destination);
  
  // Gán FFT size là 256 cho Analyser
  // Các bạn có thể xem thêm tại: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
  audioAnalyser.fftSize = 256;
  
  // Lấy dữ liệu tần số từ Analyser
  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/frequencyBinCount
  var analyserFrequencyLength = audioAnalyser.frequencyBinCount;
  
  // Khởi tạo một 8-bit unsigned interge array có số lượng phần tử bằng analyserFrequencyLength
  var frequencyDataArray = new Uint8Array(analyserFrequencyLength);
  
  // Lấy width và height của canvas
  var canvasWith = canvasElm.width;
  var canvasHeight = canvasElm.height;
  
  // Tính toán barWidth và barHeight
  var barWidth = (canvasWith / analyserFrequencyLength) * 2;
  var barHeight= (canvasHeight / analyserFrequencyLength) * 5;
  var barIndex = 0;
  
  function renderFrame() {
    // Thông báo với trình duyệt rằng chúng ta đang chuẩn bị thực hiện một animation với method là như này. Hãy chuẩn bị đi =)
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(renderFrame);
    
    // Reset lại barIndex trở về 0
    barIndex = 0;
    
    // Điền dữ liệu tần số vào mảng
    audioAnalyser.getByteFrequencyData(frequencyDataArray);
    
    // Vẽ một hình chữ nhật với nền màu đen
    var r_a = 0.3; 
    canvasContext.fillStyle = "#040318";
    canvasContext.fillRect(0, 0, canvasWith, canvasHeight);
    
    // Chạy lần lượt từ 0 đến hết dữ liệu tần số của Analyser
    for (var i = 0; i < analyserFrequencyLength; i++) {
      barHeight = frequencyDataArray[i] * 3;
      // Tạo màu cho thanh bar
      var rgbRed = barHeight + (25 * (i / analyserFrequencyLength));
      var rgbGreen = 250 * (i / analyserFrequencyLength);
      var rgbBlue = 50;
      
      // Điền màu và vẽ bar
      canvasContext.fillStyle = "rgb("+ rgbRed +", "+ rgbGreen +", "+ rgbBlue + ")";
      canvasContext.fillRect(barIndex, (canvasHeight - barHeight), barWidth, barHeight);

      barIndex += (barWidth + 1);
    }
  }
  // Gọi method để render vào canvas
  renderFrame();
}
}