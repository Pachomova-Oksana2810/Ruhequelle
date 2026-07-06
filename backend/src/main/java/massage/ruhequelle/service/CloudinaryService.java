package massage.ruhequelle.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url:}") String cloudinaryUrl) {
        if (cloudinaryUrl == null || cloudinaryUrl.isBlank()) {
            log.warn("Cloudinary URL is blank — file uploads will be disabled");
            this.cloudinary = null;
        } else {
            this.cloudinary = new Cloudinary(cloudinaryUrl);
        }
    }

    public boolean isConfigured() {
        return cloudinary != null;
    }

    public String upload(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            throw new IllegalStateException("Cloudinary is not configured");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")
        );
        Object url = result.get("secure_url");
        if (url == null) {
            url = result.get("url");
        }
        if (url == null) {
            throw new IOException("Upload succeeded but no URL returned");
        }
        return url.toString();
    }
}
