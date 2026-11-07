SRC := src
DST := dist
BLD := build
SITE := $(SRC)/site

MKDIR := mkdir -p
MARKDOWN := node $(SRC)/markdown.js
GEN_CTX := node $(SRC)/genContext.js
GEN_FILE_MAP := node $(SRC)/genFileMap.js

MD_FILES := $(shell find $(SITE) -name "*.md" ! -wholename "*/blog/*")
BLOG_FILES := $(sheld find $(SITE) -wholename "*/blog/*.md")
ALL_MD_FILES := $(MD_FILES) $(BLOG_FILES)
HTML_FILES := $(patsubst $(SITE)/%.md, $(DST)/%.html, $(MD_FILES))
SRC_ASSETS := $(shell find $(SITE)/assets)
GBL_CTX := $(BLD)/context.json

# CAUTION this next bit is some black magic
# dynamically generate rules for files that need special directory handling
# IE src/site/blog/foo.md -> dist/blog/<date>/<title-slug>/index.html
define MD_TEMPLATE
$(1): $(2) $(GBL_CTX)
	$(MKDIR) $$(dir $(1))
	$(MARKDOWN) --context $(word 2, $^) $$< >> $$@
endef

MD_MAPPING := $(shell $(GEN_FILE_MAP) $(BLOG_FILES))

$(foreach pair, $(MD_MAPPING), \
	$(eval $(call MD_TEMPLATE,$(word 1,$(subst :, ,$(pair))),$(word 2,$(subst :, ,$(pair)))))
)


$(BLD)/context.json: $(ALL_MD_FILES)
	$(GEN_CTX) $^ >> $@

# pattern rule should work for files that don't need special directory handling
# src/site/about.md -> dist/about/index.html
$(DST)/%/index.html: $(SITE)/%.md $(GBL_CTX)
	$(MKDIR) $(dir $@)
	$(MARKDOWN) --context $(word 2, $^) $< >> $@

all: build_dirs $(HTML_FILES)


.PHONY: build_dirs
build_dirs:
	$(MKDIR) $(DST)
	$(MKDIR) $(BLD)

.PHONY: clean
clean:
	$(RM) $(DST) $(BLD)

.PHONY:
server:
	http-server $(DST)
